

import React, { useState } from 'react';
import { VALID_ACCESS_CODES, SESSION_DURATION_MS, ADMIN_CODE } from '../constants';
import { UserSession } from '../types';
import { useLanguage } from '../language';

interface AccessGateProps {
  onAccessGranted: (session: UserSession) => void;
}

const AccessGate: React.FC<AccessGateProps> = ({ onAccessGranted }) => {
  const { t } = useLanguage();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Admin State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [adminUserName, setAdminUserName] = useState('');
  const [adminDurationDays, setAdminDurationDays] = useState('1'); // Default 1 day

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const trimmedCode = code.trim();
      
      // 1. Check if it is valid (Constants OR LocalStorage)
      const storedCodes = JSON.parse(localStorage.getItem('ht_custom_codes') || '[]');
      const isValid = VALID_ACCESS_CODES.includes(trimmedCode) || storedCodes.includes(trimmedCode);

      if (isValid) {
        
        const isAdmin = trimmedCode === ADMIN_CODE;
        if (isAdmin) {
             setSuccessMsg(t.adminWelcome);
             setIsAdminMode(true);
             setIsLoading(false);
             return; // Don't login immediately, show dashboard
        }

        // 2. Determine Duration
        // Check if there is specific metadata for this code
        const codeMetadata = JSON.parse(localStorage.getItem('ht_code_metadata') || '{}');
        let duration = SESSION_DURATION_MS; // Default 24h
        
        if (codeMetadata[trimmedCode]) {
            duration = codeMetadata[trimmedCode];
        }

        loginUser(trimmedCode, false, duration);

      } else {
        setError(t.invalidCode);
        setIsLoading(false);
      }
    }, 800);
  };

  const loginUser = (accessCode: string, isAdmin: boolean, duration: number = SESSION_DURATION_MS) => {
    const session: UserSession = {
      accessCode: accessCode,
      expiry: Date.now() + duration,
      isAdmin: isAdmin
    };
    onAccessGranted(session);
  };

  const generateNewCode = () => {
      if (!adminUserName.trim()) {
          setError("User name is required");
          return;
      }
      setError('');

      // Generate format "NAME-XXXX"
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const cleanName = adminUserName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const newCode = `${cleanName}-${randomPart}`;
      
      // Calculate duration in MS
      const days = parseInt(adminDurationDays);
      const durationMs = days * 24 * 60 * 60 * 1000;

      // Save valid code list
      const storedCodes = JSON.parse(localStorage.getItem('ht_custom_codes') || '[]');
      storedCodes.push(newCode);
      localStorage.setItem('ht_custom_codes', JSON.stringify(storedCodes));
      
      // Save metadata (duration)
      const metadata = JSON.parse(localStorage.getItem('ht_code_metadata') || '{}');
      metadata[newCode] = durationMs;
      localStorage.setItem('ht_code_metadata', JSON.stringify(metadata));

      setGeneratedCode(newCode);
  };

  const copyCode = () => {
      navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto px-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isAdminMode ? 'from-purple-500 to-pink-500' : 'from-cyan-500 to-purple-500'}`}></div>
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">
            {isAdminMode ? t.adminDashboard : t.gateTitle}
        </h2>
        
        {!isAdminMode && (
             <p className="text-slate-400 text-center mb-8">{t.gateSubtitle}</p>
        )}
        
        {/* ADMIN DASHBOARD VIEW */}
        {isAdminMode ? (
            <div className="space-y-6 mt-6">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-left">
                    <p className="text-sm text-slate-500 mb-4 text-center">Generate access codes for new users.</p>
                    
                    {/* Admin Inputs */}
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">{t.adminUserLabel}</label>
                            <input 
                                type="text" 
                                value={adminUserName}
                                onChange={(e) => setAdminUserName(e.target.value)}
                                placeholder="e.g. Vintec"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">{t.adminDurationLabel}</label>
                            <select 
                                value={adminDurationDays}
                                onChange={(e) => setAdminDurationDays(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                            >
                                <option value="1">1 {t.days}</option>
                                <option value="3">3 {t.days}</option>
                                <option value="7">7 {t.days}</option>
                                <option value="30">30 {t.days}</option>
                                <option value="365">1 Year</option>
                            </select>
                        </div>
                    </div>

                    {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

                    {generatedCode ? (
                        <div className="bg-slate-900 p-3 rounded-lg border border-purple-500/30 mb-4 flex items-center justify-between animate-fade-in">
                            <code className="text-xl font-mono text-purple-400 font-bold tracking-wider">{generatedCode}</code>
                            <button onClick={copyCode} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded transition-colors">
                                {t.copy}
                            </button>
                        </div>
                    ) : null}

                    <button
                        onClick={generateNewCode}
                        className="w-full py-2 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20 mb-2"
                    >
                        {t.generateCode}
                    </button>
                </div>

                <div className="border-t border-slate-800 pt-4">
                     <button
                        onClick={() => loginUser(code, true)}
                        className="w-full py-3 px-4 rounded-lg font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all"
                    >
                        {t.enterPlatform}
                    </button>
                </div>
            </div>
        ) : (
            /* STANDARD LOGIN VIEW */
            <>
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
                {t.enterCode}
                </label>
                <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-600 transition-all outline-none"
                autoComplete="off"
                />
            </div>
            
            {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm flex items-center animate-shake">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
                </div>
            )}

            {successMsg && !isAdminMode && (
                <div className="p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {successMsg}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !code}
                className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading || !code 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-900/20'
                }`}
            >
                {isLoading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {t.verifying}
                </span>
                ) : (
                t.unlock
                )}
            </button>
            </form>
            
            {/* Contact Admin Link */}
            <div className="mt-6 text-center text-sm text-slate-500">
                <span>{t.noCode} </span>
                <a 
                    href="https://wa.link/xuiyx6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
                >
                    {t.contactAdmin}
                </a>
            </div>
            </>
        )}

        <div className="mt-6 text-center text-xs text-slate-600 border-t border-slate-800 pt-4">
          {t.poweredBy}
        </div>
      </div>
    </div>
  );
};

export default AccessGate;