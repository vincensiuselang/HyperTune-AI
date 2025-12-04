
import React, { useEffect, useState } from 'react';
import { AVAILABLE_MODELS, TUNING_METHODS, MODEL_PRESETS, DEFAULT_N_TRIALS, DEFAULT_CV_FOLDS } from '../constants';
import { analyzeDataset } from '../services/geminiService';
import { DatasetPreview, ModelType, TuningConfig, TuningMethod } from '../types';
import { useLanguage } from '../language';

interface ModelConfigProps {
  dataset: DatasetPreview;
  onStartTuning: (config: TuningConfig) => void;
  onBack: () => void;
}

const ModelConfig: React.FC<ModelConfigProps> = ({ dataset, onStartTuning, onBack }) => {
  const { t, language } = useLanguage();
  const [targetCol, setTargetCol] = useState(dataset.columns[dataset.columns.length - 1]);
  const [modelType, setModelType] = useState<ModelType>(ModelType.RANDOM_FOREST);
  const [tuningMethod, setTuningMethod] = useState<TuningMethod>(TuningMethod.BAYESIAN_OPTUNA);
  
  // Advanced Settings
  const [nTrials, setNTrials] = useState<number>(DEFAULT_N_TRIALS);
  const [cvFolds, setCvFolds] = useState<number>(DEFAULT_CV_FOLDS);

  // Default to the first available preset
  const [selectedPreset, setSelectedPreset] = useState<string>('Balanced');
  const [hyperparams, setHyperparams] = useState('');
  
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-analysis on mount
  useEffect(() => {
    const runAnalysis = async () => {
        setIsAnalyzing(true);
        const result = await analyzeDataset(dataset);
        setAiSuggestion(result);
        setIsAnalyzing(false);
    };
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Update hyperparams and preset selection when model changes
  useEffect(() => {
    const presets = MODEL_PRESETS[modelType];
    if (presets) {
      // Prefer 'Balanced' if it exists, otherwise take the first key
      const defaultPreset = Object.keys(presets).includes('Balanced') ? 'Balanced' : Object.keys(presets)[0];
      setSelectedPreset(defaultPreset);
      setHyperparams(presets[defaultPreset]);
    }
  }, [modelType]);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    setSelectedPreset(presetName);
    if (presetName !== 'Custom') {
      setHyperparams(MODEL_PRESETS[modelType][presetName]);
    }
  };

  const handleHyperparamsEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHyperparams(e.target.value);
    setSelectedPreset('Custom');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTuning({
      targetColumn: targetCol,
      modelType,
      tuningMethod,
      testSize: 0.2,
      nTrials,
      cvFolds,
      hyperparams
    });
  };

  const selectedModelDef = AVAILABLE_MODELS.find(m => m.value === modelType) || AVAILABLE_MODELS[0];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">{t.configTitle}</h2>
          <div className="flex items-center mt-2 text-slate-400 text-sm">
             <span>Dataset:</span>
             <span className="ml-2 text-cyan-400 font-mono bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/50">
                {dataset.filename}
             </span>
             <span className="mx-2 text-slate-600">•</span>
             <span>{dataset.rowCount.toLocaleString()} {t.rows}</span>
          </div>
        </div>
        <button 
          onClick={onBack} 
          className="group flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2 group-hover:bg-slate-700 transition-colors">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </div>
          {t.selectDataset}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-xl">
            
            {/* Target Variable */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                {t.targetVar}
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-600"
                  value={targetCol}
                  onChange={(e) => setTargetCol(e.target.value)}
                >
                  {dataset.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
               {isAnalyzing ? (
                   <div className="mt-3 flex items-center text-xs text-cyan-400">
                      <svg className="animate-spin w-3 h-3 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      {t.analyzing}
                   </div>
               ) : (
                   aiSuggestion && (
                     <div className="mt-3 text-xs text-cyan-300/90 flex gap-2 items-start bg-cyan-950/20 p-3 rounded-lg border border-cyan-900/30">
                       <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                       <span className="leading-relaxed">{aiSuggestion}</span>
                     </div>
                   )
               )}
            </div>

            {/* Model Selection (Dropdown) */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-3 flex items-center">
                 <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                 {t.selectModel}
              </label>
              
              <div className="relative mb-4">
                <select 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer hover:border-slate-600"
                  value={modelType}
                  onChange={(e) => setModelType(e.target.value as ModelType)}
                >
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>

              {/* Selected Model Detail Card */}
              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex items-start gap-4 animate-fade-in">
                 <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={selectedModelDef.iconPath} />
                    </svg>
                 </div>
                 <div>
                    <h3 className="font-bold text-sm text-white mb-1">{selectedModelDef.label}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{selectedModelDef.description[language]}</p>
                 </div>
              </div>
            </div>

            {/* Hyperparameters Config */}
            <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <label className="text-sm font-bold text-slate-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  {t.hyperparams}
                </label>
                <div className="group flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:bg-slate-800 transition-all duration-300 cursor-pointer">
                   <span className="text-xs text-slate-400 group-hover:text-cyan-400/80 px-2 font-medium transition-colors">{t.preset}</span>
                   <select 
                      value={selectedPreset}
                      onChange={handlePresetChange}
                      className="bg-transparent text-xs text-white px-2 py-1 outline-none cursor-pointer font-medium group-hover:text-cyan-400 transition-colors"
                   >
                     {Object.keys(MODEL_PRESETS[modelType]).map(preset => (
                       <option key={preset} value={preset} className="bg-slate-900">{preset}</option>
                     ))}
                     <option value="Custom" className="bg-slate-900">{t.custom}</option>
                   </select>
                </div>
              </div>
              <div className="relative group">
                <textarea
                  value={hyperparams}
                  onChange={handleHyperparamsEdit}
                  rows={5}
                  spellCheck={false}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm font-mono text-emerald-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none transition-all group-hover:border-slate-600"
                />
                <div className="absolute top-3 right-4 text-[10px] text-slate-600 font-mono pointer-events-none bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  YAML-like Format
                </div>
              </div>
            </div>

            {/* Tuning Strategy */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                {t.tuningStrategy}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TUNING_METHODS.map(method => {
                    const isSelected = tuningMethod === method.value;
                    return (
                        <div 
                            key={method.value}
                            onClick={() => setTuningMethod(method.value)}
                            className={`
                                relative cursor-pointer rounded-xl border p-5 transition-all duration-300 flex flex-col justify-between group
                                ${isSelected 
                                ? 'bg-gradient-to-br from-cyan-900/20 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-900/10' 
                                : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'}
                            `}
                        >
                            <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center space-x-3">
                                    <div className={`
                                         p-2 rounded-lg transition-colors
                                         ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 border border-slate-700 text-slate-500 group-hover:text-cyan-400/70'}
                                    `}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.iconPath} />
                                        </svg>
                                    </div>
                                    <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
                                        {method.label}
                                    </div>
                                 </div>

                                {method.badge && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${
                                        method.badge === 'Recommended' 
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-900/30' 
                                        : 'bg-slate-700 text-slate-300'
                                    }`}>
                                        {method.badge}
                                    </span>
                                )}
                            </div>
                            
                            <p className={`text-xs leading-relaxed pl-12 transition-colors ${isSelected ? 'text-cyan-100/70' : 'text-slate-500'}`}>
                                {method.description[language]}
                            </p>
                            
                            {/* Selection Ring */}
                            <div className={`absolute bottom-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected ? 'border-cyan-400' : 'border-slate-700 group-hover:border-slate-500'
                            }`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_currentColor]" />}
                            </div>
                        </div>
                    );
                })}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-slate-950/30 p-5 rounded-xl border border-slate-800/50">
                <div className="flex items-center mb-4">
                     <svg className="w-4 h-4 text-slate-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.advancedConfig}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">{t.nTrials}</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                min="5" 
                                max="200"
                                value={nTrials}
                                onChange={(e) => setNTrials(parseInt(e.target.value) || 10)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">{t.runs}</div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{t.trialsDesc}</p>
                     </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">{t.cvFolds}</label>
                         <div className="relative">
                            <input 
                                type="number" 
                                min="2" 
                                max="10"
                                value={cvFolds}
                                onChange={(e) => setCvFolds(parseInt(e.target.value) || 3)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">{t.folds}</div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{t.foldsDesc}</p>
                     </div>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="group w-full relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform hover:scale-[1.005] active:scale-[0.995]"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {t.launchBtn}
                    </span>
                </button>
            </div>
          </form>
        </div>

        {/* Right Column: Preview Info & Guide */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Dataset Card */}
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-lg backdrop-blur-sm">
             <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.dataPreview}</h3>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{dataset.columns.length} Cols</span>
             </div>
             
             <div className="space-y-3 font-mono">
                 {dataset.sampleData.slice(0, 4).map((row, i) => (
                     <div key={i} className="text-[10px] text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis p-1 hover:bg-slate-800/50 rounded transition-colors cursor-default">
                         <span className="text-cyan-600 mr-2 opacity-70">[{i}]:</span>
                         {Object.values(row).slice(0, 3).join(', ')}...
                     </div>
                 ))}
             </div>
             <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
                <span>{t.totalSamples}</span>
                <span className="text-slate-300 font-mono">{dataset.rowCount.toLocaleString()}</span>
             </div>
          </div>
          
          {/* Guide Card */}
          <div className="relative p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl"></div>
             <div className="absolute top-4 right-4 text-cyan-500/10">
                 <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
             </div>
             
            <h4 className="font-bold text-slate-200 mb-4 relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {t.tuningTips}
            </h4>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {t.tip1}
                  </span>
              </li>
              <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {t.tip2}
                  </span>
              </li>
              <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 mr-3 flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    {t.tip3}
                  </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelConfig;
