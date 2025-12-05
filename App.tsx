
import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ModelConfig from './components/ModelConfig';
import TuningDashboard from './components/TuningDashboard';
import ResultsView from './components/ResultsView';
import Layout from './components/Layout';
import AccessGate from './components/AccessGate';
import ErrorBoundary from './components/ErrorBoundary';
import { AppStep, DatasetPreview, TuningConfig, TuningResult, UserSession } from './types';
import { LanguageProvider } from './language';
import { FREE_TRIAL_LIMIT } from './constants';

const AppContent: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [dataset, setDataset] = useState<DatasetPreview | null>(null);
  const [config, setConfig] = useState<TuningConfig | null>(null);
  const [result, setResult] = useState<TuningResult | null>(null);

  // Access Control State
  const [session, setSession] = useState<UserSession | null>(null);
  // Initialize usage from localStorage or 0
  const [usageCount, setUsageCount] = useState<number>(() => {
    const saved = localStorage.getItem('ht_usage');
    return saved ? parseInt(saved, 10) : 0;
  });

  const isAccessLocked = () => {
    // If user has a valid session, it's not locked.
    if (session && session.expiry > Date.now()) return false;
    // If usage is below limit, it's not locked.
    if (usageCount < FREE_TRIAL_LIMIT) return false;
    // Otherwise locked
    return true;
  };

  useEffect(() => {
     // Check lock status. 
     // IMPORTANT: Only redirect to Gate if we are on the UPLOAD step (or Gate step).
     // This allows the user to finish their current experiment (Config/Tuning/Results)
     // even if the limit was hit during the upload of that experiment.
     if (isAccessLocked() && step === AppStep.UPLOAD) {
         setStep(AppStep.ACCESS_GATE);
     }
  }, [usageCount, session, step]);

  const handleAccessGranted = (newSession: UserSession) => {
    setSession(newSession);
    setStep(AppStep.UPLOAD);
  };

  const handleFileProcessed = (data: DatasetPreview) => {
    // Increment usage count immediately upon successful upload
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('ht_usage', newCount.toString());

    setDataset(data);
    setStep(AppStep.CONFIG);
  };

  const handleStartTuning = (newConfig: TuningConfig) => {
    setConfig(newConfig);
    setStep(AppStep.TUNING);
  };

  const handleTuningComplete = (results: TuningResult) => {
    setResult(results);
    setStep(AppStep.RESULTS);
    
    // Usage increment moved to handleFileProcessed to track uploads specifically.
  };

  const handleReset = () => {
    // If the new count exceeds limit and no session, we must lock
    // This handles the transition from Results -> Upload (which triggers Gate)
    if (isAccessLocked()) {
        setStep(AppStep.ACCESS_GATE);
    } else {
        setDataset(null);
        setConfig(null);
        setResult(null);
        setStep(AppStep.UPLOAD);
    }
  };

  const handleBackToConfig = () => {
    setStep(AppStep.CONFIG);
  };

  return (
    <Layout>
      {step === AppStep.ACCESS_GATE && (
        <AccessGate onAccessGranted={handleAccessGranted} />
      )}

      {step === AppStep.UPLOAD && !isAccessLocked() && (
        <FileUpload onFileProcessed={handleFileProcessed} />
      )}

      {step === AppStep.CONFIG && dataset && (
        <ModelConfig 
          dataset={dataset} 
          onStartTuning={handleStartTuning} 
          onBack={() => setStep(AppStep.UPLOAD)}
        />
      )}

      {step === AppStep.TUNING && config && dataset && (
        <ErrorBoundary onBack={handleBackToConfig}>
          <TuningDashboard 
            config={config} 
            dataset={dataset} 
            onComplete={handleTuningComplete} 
          />
        </ErrorBoundary>
      )}

      {step === AppStep.RESULTS && result && dataset && config && (
        <ResultsView 
          result={result} 
          dataset={dataset} 
          config={config}
          onReset={handleReset} 
        />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
