
import React, { useState } from 'react';
import { TuningResult, DatasetPreview, TuningConfig } from '../types';
import { useLanguage } from '../language';
import { generateShapScript } from '../services/geminiService';

interface ResultsViewProps {
  result: TuningResult;
  dataset: DatasetPreview;
  config: TuningConfig;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result, dataset, config, onReset }) => {
  const { t } = useLanguage();
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // SHAP State
  const [shapScript, setShapScript] = useState<string>('');
  const [isGeneratingShap, setIsGeneratingShap] = useState(false);
  const [isShapOpen, setIsShapOpen] = useState(true);

  const downloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([result.pythonScript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "train_best_model.py";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.pythonScript);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleGenerateShap = async () => {
      setIsGeneratingShap(true);
      const script = await generateShapScript(dataset, config);
      setShapScript(script);
      setIsGeneratingShap(false);
  };

  const copyShapToClipboard = async () => {
      try {
          await navigator.clipboard.writeText(shapScript);
          // Optional: Add separate success state for SHAP
      } catch (err) {
          console.error(err);
      }
  };

  const downloadParams = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(result.bestParams, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "best_params.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4 ring-1 ring-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse-slow">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.resTitle}</h2>
        <p className="text-slate-400">{t.resSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center shadow-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 relative z-10">{t.bestScore}</p>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 relative z-10 mb-2">
            {(result.bestScore * 100).toFixed(2)}%
          </div>
          <div className="relative z-10 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50 flex items-center">
             <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse"></span>
             <p className="text-slate-300 text-sm font-mono uppercase">{result.metric}</p>
          </div>
        </div>

        {/* Params Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl md:col-span-2 shadow-xl flex flex-col">
           <div className="flex justify-between items-center mb-6 border-b border-slate-800/50 pb-4">
             <div className="flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                <p className="text-slate-200 text-sm font-bold uppercase tracking-wider">{t.bestConfig}</p>
             </div>
             <button onClick={downloadParams} className="text-xs text-slate-400 hover:text-white flex items-center transition-colors group">
               <span className="mr-2 group-hover:underline">{t.exportJson}</span>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
             </button>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar max-h-48 pr-2">
             {Object.entries(result.bestParams).map(([key, value]) => (
               <div key={key} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors group">
                 <div className="text-[10px] text-slate-500 mb-1 truncate group-hover:text-slate-400 transition-colors" title={key}>{key}</div>
                 <div className="text-sm text-cyan-300 font-mono truncate" title={String(value)}>{String(value)}</div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Deployment Guide */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <h3 className="text-lg font-bold text-white mb-6 flex items-center relative z-10">
            <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 text-cyan-400 border border-slate-700 shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </span>
            {t.deployGuide}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div>
            <div className="flex items-center mb-3">
                <span className="w-5 h-5 rounded-full bg-cyan-900/50 text-cyan-400 text-xs flex items-center justify-center mr-2 border border-cyan-800">1</span>
                <p className="text-slate-300 text-sm font-medium">{t.step1}</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-slate-800/50 group hover:border-slate-700 transition-colors backdrop-blur-sm">
                <code className="text-xs text-slate-500 font-mono block mb-2 select-none"># Install dependencies</code>
                <code className="text-xs text-cyan-300 font-mono block mb-4">pip install pandas scikit-learn xgboost joblib</code>
                <code className="text-xs text-slate-500 font-mono block mb-2 select-none"># Run the training script</code>
                <code className="text-xs text-emerald-400 font-mono block">python train_best_model.py</code>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 ml-1">
                {t.step1Desc}
            </p>
          </div>

          <div>
            <div className="flex items-center mb-3">
                <span className="w-5 h-5 rounded-full bg-cyan-900/50 text-cyan-400 text-xs flex items-center justify-center mr-2 border border-cyan-800">2</span>
                <p className="text-slate-300 text-sm font-medium">{t.step2}</p>
            </div>
            <div className="bg-black/40 p-4 rounded-lg border border-slate-800/50 group hover:border-slate-700 transition-colors h-full backdrop-blur-sm">
                <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap">
<span className="text-purple-400">import</span> joblib{'\n\n'}
<span className="text-slate-500"># Load your trained model</span>{'\n'}
model = joblib.load(<span className="text-green-400">'model.pkl'</span>){'\n\n'}
<span className="text-slate-500"># Predict on new data</span>{'\n'}
predictions = model.predict(new_data)
                </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer (Dropdown) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-8 transition-all duration-300">
        <div 
            className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 cursor-pointer hover:bg-slate-900/80 transition-colors select-none"
            onClick={() => setIsCodeOpen(!isCodeOpen)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${isCodeOpen ? 'bg-cyan-900/20 text-cyan-400 border-cyan-900/30' : ''}`}>
                 <svg className={`w-4 h-4 transition-transform duration-300 ${isCodeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
            </div>
            <span className={`text-sm font-bold transition-colors ${isCodeOpen ? 'text-white' : 'text-slate-400'}`}>
                {t.genScriptLabel}
            </span>
          </div>
          <span className="text-xs text-slate-500">
             {isCodeOpen ? t.clickCollapse : t.clickExpand}
          </span>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${isCodeOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            
            {/* Toolbar inside the expanded section */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900/50 border-b border-slate-800/50">
               <div className="flex items-center space-x-2">
                 <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <span className="text-xs text-slate-300 font-mono">train_best_model.py</span>
               </div>
               
               <div className="flex items-center space-x-3">
                 <button 
                    onClick={copyToClipboard}
                    className={`
                        text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center font-medium
                        ${copySuccess 
                            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}
                    `}
                 >
                     {copySuccess ? (
                         <>
                            <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {t.copied}
                         </>
                     ) : (
                         <>
                            <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            {t.copy}
                         </>
                     )}
                 </button>

                 <button 
                    onClick={downloadScript}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-4 py-1.5 rounded-lg transition-colors flex items-center font-medium shadow-lg shadow-cyan-900/20"
                 >
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {t.download}
                 </button>
               </div>
            </div>

            <div className="p-0 overflow-x-auto custom-scrollbar">
            <pre className="text-sm font-mono text-slate-300 p-6 leading-relaxed bg-[#0B1120]">
                <code>{result.pythonScript}</code>
            </pre>
            </div>
        </div>
      </div>

       {/* Execution Logs (Dropdown) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl mb-8 transition-all duration-300">
        <div 
            className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 cursor-pointer hover:bg-slate-900/80 transition-colors select-none"
            onClick={() => setIsLogsOpen(!isLogsOpen)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${isLogsOpen ? 'bg-cyan-900/20 text-cyan-400 border-cyan-900/30' : ''}`}>
                 <svg className={`w-4 h-4 transition-transform duration-300 ${isLogsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
            </div>
            <span className={`text-sm font-bold transition-colors ${isLogsOpen ? 'text-white' : 'text-slate-400'}`}>
                {t.execLogs}
            </span>
          </div>
          <span className="text-xs text-slate-500">
             {isLogsOpen ? t.clickCollapse : t.clickExpand}
          </span>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${isLogsOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-0 overflow-x-auto custom-scrollbar bg-black">
                <div className="p-6 font-mono text-xs sm:text-sm space-y-1">
                    {result.executionLog.map((log, i) => (
                        <div key={i} className={`${log.toLowerCase().includes('error') ? 'text-red-400' : log.includes('best') || log.includes('Best') ? 'text-green-400' : 'text-slate-300'}`}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* SHAP Explainability Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="px-6 py-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h3 className="text-lg font-bold text-white flex items-center">
                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/50 flex items-center justify-center mr-3 text-pink-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </span>
                    {t.shapTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1 ml-11">{t.shapSubtitle}</p>
             </div>
             
             {!shapScript && (
                 <button 
                    onClick={handleGenerateShap}
                    disabled={isGeneratingShap}
                    className={`
                        px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all flex items-center
                        ${isGeneratingShap ? 'bg-slate-700 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/20'}
                    `}
                 >
                    {isGeneratingShap ? (
                         <>
                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                             {t.shapGenerating}
                         </>
                    ) : (
                        t.genShapBtn
                    )}
                 </button>
             )}
          </div>

          {shapScript && (
             <div className="bg-slate-950/50">
                 <div 
                    className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800/50 cursor-pointer"
                    onClick={() => setIsShapOpen(!isShapOpen)}
                 >
                    <div className="flex items-center space-x-2">
                         <div className={`transition-transform duration-300 ${isShapOpen ? 'rotate-180' : ''}`}>
                             <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                         </div>
                        <span className="text-xs text-pink-400 font-mono font-bold uppercase tracking-wide">{t.shapCodeLabel}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); copyShapToClipboard(); }} className="text-xs text-slate-500 hover:text-white transition-colors">
                        {t.copy}
                    </button>
                 </div>
                 
                 <div className={`transition-all duration-300 ${isShapOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                     <div className="p-6 bg-[#0B1120] relative">
                        <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {shapScript}
                        </pre>
                        
                        <div className="mt-4 p-3 bg-blue-900/10 border border-blue-900/30 rounded text-blue-300/80 text-[10px] flex items-start">
                             <svg className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             {t.shapTip}
                        </div>
                     </div>
                 </div>
             </div>
          )}
      </div>

      {/* Data Preview Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mb-8">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center">
                <svg className="w-5 h-5 mr-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {t.dataPreview}
            </h3>
            <span className="text-xs font-mono text-slate-500">{dataset.rowCount.toLocaleString()} {t.rows}</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-300">
                    <tr>
                        {dataset.columns.map(col => <th key={col} className="px-6 py-3 whitespace-nowrap border-b border-slate-800">{col}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {dataset.sampleData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            {dataset.columns.map(col => <td key={col} className="px-6 py-3 whitespace-nowrap">{row[col]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onReset}
          className="group text-slate-400 hover:text-white px-8 py-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900 transition-all font-medium flex items-center justify-center mx-auto"
        >
          <svg className="w-4 h-4 mr-2 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          {t.startNew}
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
