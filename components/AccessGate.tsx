

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const trimmedCode = code.trim();
      
      // Check hardcoded constants AND local storage generated codes
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

        loginUser(trimmedCode, false);

      } else {
        setError(t.invalidCode);
        setIsLoading(false);
      }
    }, 800);
  };

  const loginUser = (accessCode: string, isAdmin: boolean) => {
    const session: UserSession = {
      accessCode: accessCode,
      expiry: Date.now() + SESSION_DURATION_MS,
      isAdmin: isAdmin
    };
    onAccessGranted(session);
  };

  const generateNewCode = () => {
      // Generate format "USER-XXXX"
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const newCode = `USER-${randomPart}`;
      
      // Save to local storage
      const storedCodes = JSON.parse(localStorage.getItem('ht_custom_codes') || '[]');
      storedCodes.push(newCode);
      localStorage.setItem('ht_custom_codes', JSON.stringify(storedCodes));
      
      setGeneratedCode(newCode);
  };

  const copyCode = () => {
      navigator.clipboard.writeText(generatedCode);
      // Visual feedback handled by button state ideally, keeping it simple here
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
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <p className="text-sm text-slate-500 mb-4">Generate access codes for new users.</p>
                    
                    {generatedCode ? (
                        <div className="bg-slate-900 p-3 rounded-lg border border-purple-500/30 mb-4 flex items-center justify-between">
                            <code className="text-xl font-mono text-purple-400 font-bold">{generatedCode}</code>
                            <button onClick={copyCode} className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded">
                                {t.copy}
                            </button>
                        </div>
                    ) : (
                         <div className="h-14 flex items-center justify-center text-slate-700 text-xs italic">
                            No code generated yet
                         </div>
                    )}

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
                // placeholder="Code"
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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.verifying}
                </span>
                ) : (
                t.unlock
                )}
            </button>
            </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-500">
          {t.poweredBy}
        </div>
      </div>
    </div>
  );
};

export default AccessGate;