
import React, { useEffect, useState, useRef } from 'react';
import { TuningConfig, TuningResult, GenerationResult } from '../types';
import { generateTrainingScript } from '../services/geminiService';
import { useLanguage } from '../language';

interface TuningDashboardProps {
  config: TuningConfig;
  dataset: any;
  onComplete: (result: TuningResult) => void;
}

const TuningDashboard: React.FC<TuningDashboardProps> = ({ config, dataset, onComplete }) => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Ref to track if we are already running to prevent double-fire in React 18 strict mode
  const runningRef = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (runningRef.current) return;
    runningRef.current = true;

    // Use translations for logs
    const STARTUP_LOGS = [
      t.bootInit,
      t.bootAlloc,
      t.bootLoad,
      t.bootValid,
      t.bootSetup,
      t.bootImport,
      t.bootConnect,
    ];

    let simulationInterval: any;
    let startupInterval: any;

    const runTuning = async () => {
        // --- PHASE 1: Immediate Feedback (While waiting for API) ---
        // Show startup logs immediately so user knows system is working
        let startupIndex = 0;
        
        // Initial log
        setLogs([`> ${t.bootStart}`]);

        startupInterval = setInterval(() => {
            if (startupIndex < STARTUP_LOGS.length) {
                setLogs(prev => [...prev, `> ${STARTUP_LOGS[startupIndex]}`]);
                setProgress(prev => Math.min(prev + 8, 50)); // Cap at 50% during startup, faster increments
                startupIndex++;
            }
        }, 80); // Ultra-fast startup logs (80ms)

        try {
            // Call API (This can take 2-5 seconds)
            const result: GenerationResult = await generateTrainingScript(dataset, config);
            
            // API returned, clear startup logs interval
            clearInterval(startupInterval);

            if (result.script.startsWith("# Error")) {
                setLogs(prev => [...prev, ...result.logs]);
                setProgress(100);
                return; // Stop here on error
            }

            // --- PHASE 2: Fast Playback of Generated Logs ---
            setLogs(prev => [...prev, `> ${t.optSuccess}`, `> ${t.startTrials}`]);
            
            // Jump progress to indicate phase change
            setProgress(prev => Math.max(prev, 55));

            const totalLogs = result.logs.length;
            let currentLogIndex = 0;
            
            // Play back the AI logs instantly (5ms)
            simulationInterval = setInterval(() => {
                if (currentLogIndex < totalLogs) {
                    const log = result.logs[currentLogIndex];
                    setLogs(prev => [...prev, `> ${log}`]);
                    
                    // Map remaining progress (55% -> 98%)
                    const logProgress = 55 + ((currentLogIndex + 1) / totalLogs) * 43;
                    setProgress(Math.min(logProgress, 98));
                    
                    currentLogIndex++;
                } else {
                    // Finished playing logs
                    clearInterval(simulationInterval);
                    setProgress(100);
                    setLogs(prev => [...prev, `> ${t.optComplete}`, `> ${t.finalize}`]);
                    
                    setTimeout(() => {
                        onComplete({
                            bestParams: result.bestParams,
                            bestScore: result.bestScore,
                            metric: result.metric,
                            pythonScript: result.script,
                            executionLog: [...logs, ...result.logs] 
                        });
                    }, 300); // Reduce final wait to 300ms
                }
            }, 5); // HYPER SPEED: 5ms per line

        } catch (e: any) {
            clearInterval(startupInterval);
            setLogs(prev => [...prev, `> Critical Error: ${e.message || 'Unknown error occurred.'}`]);
        }
    };

    runTuning();

    return () => {
        clearInterval(startupInterval);
        clearInterval(simulationInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6 animate-pulse">{t.optimizing}</h2>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-4 mb-8 overflow-hidden relative">
        <div 
          className="bg-cyan-500 h-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(6,182,212,0.7)]"
          style={{ width: `${progress}%` }}
        ></div>
        {/* Shimmer effect */}
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      {/* Terminal View */}
      <div className="w-full bg-black rounded-lg border border-slate-800 p-4 font-mono text-xs sm:text-sm h-96 overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center space-x-2 mb-2 border-b border-slate-900 pb-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <div className="w-3 h-3 rounded-full bg-green-500"></div>
           <span className="text-slate-500 ml-2">worker-node-01:~/jobs/{config.modelType.toLowerCase()}</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 scroll-smooth" ref={scrollRef}>
           {logs.map((log, i) => (
             <div key={i} className={`${log.toLowerCase().includes('error') ? 'text-red-400' : log.includes('best') || log.includes('Best') ? 'text-green-400 font-bold' : 'text-slate-300'}`}>
               {log}
             </div>
           ))}
           <div className="animate-pulse text-cyan-500">_</div>
        </div>
      </div>
      
      <div className="mt-6 flex gap-4 text-slate-500 text-sm">
        <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            {t.tuningModel}
        </div>
        <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            {t.genScript}
        </div>
      </div>
    </div>
  );
};

export default TuningDashboard;
