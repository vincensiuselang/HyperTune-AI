import React, { useState } from 'react';
import { VALID_ACCESS_CODES, SESSION_DURATION_MS } from '../constants';
import { UserSession } from '../types';

interface AccessGateProps {
  onAccessGranted: (session: UserSession) => void;
}

const AccessGate: React.FC<AccessGateProps> = ({ onAccessGranted }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (VALID_ACCESS_CODES.includes(code.trim())) {
        const session: UserSession = {
          accessCode: code.trim(),
          expiry: Date.now() + SESSION_DURATION_MS,
        };
        onAccessGranted(session);
      } else {
        setError('Invalid Access Code. Please try "DEMO-123".');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto px-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Welcome to HyperTune</h2>
        <p className="text-slate-400 text-center mb-8">Enter your SaaS access code to initialize the tuning engine.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
              Access Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-slate-600 transition-all outline-none"
              placeholder="e.g. DEMO-123"
              autoComplete="off"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
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
                Verifying...
              </span>
            ) : (
              'Unlock Platform'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Powered by Gemini AI • Valid session: 24h
        </div>
      </div>
    </div>
  );
};

export default AccessGate;