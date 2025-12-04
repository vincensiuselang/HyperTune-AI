
import React from 'react';
import { useLanguage } from '../language';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-900/50">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {t.appName}
            </span>
          </div>

          <button 
            onClick={toggleLanguage}
            className="flex items-center px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-xs font-bold tracking-wider"
          >
            <span className={`${language === 'en' ? 'text-white' : 'text-slate-500'}`}>EN</span>
            <span className="mx-2 text-slate-600">|</span>
            <span className={`${language === 'id' ? 'text-cyan-400' : 'text-slate-500'}`}>ID</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      {/* Footer & About Section */}
      <footer className="border-t border-slate-800 bg-slate-950/50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{t.aboutTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {t.aboutText}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{t.howItWorksTitle}</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <span className="text-slate-400 text-sm"><strong>{t.featUpload}</strong> {t.featUploadDesc}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  <span className="text-slate-400 text-sm"><strong>{t.featConfig}</strong> {t.featConfigDesc}</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-cyan-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  <span className="text-slate-400 text-sm"><strong>{t.featCode}</strong> {t.featCodeDesc}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
             <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} {t.footerText}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
