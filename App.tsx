
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ModelConfig from './components/ModelConfig';
import TuningDashboard from './components/TuningDashboard';
import ResultsView from './components/ResultsView';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { AppStep, DatasetPreview, TuningConfig, TuningResult } from './types';
import { LanguageProvider } from './language';

const AppContent: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [dataset, setDataset] = useState<DatasetPreview | null>(null);
  const [config, setConfig] = useState<TuningConfig | null>(null);
  const [result, setResult] = useState<TuningResult | null>(null);

  const handleFileProcessed = (data: DatasetPreview) => {
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
  };

  const handleReset = () => {
    setDataset(null);
    setConfig(null);
    setResult(null);
    setStep(AppStep.UPLOAD);
  };

  const handleBackToConfig = () => {
    setStep(AppStep.CONFIG);
  };

  return (
    <Layout>
      {step === AppStep.UPLOAD && (
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
