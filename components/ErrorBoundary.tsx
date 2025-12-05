import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LanguageContext } from '../language';

interface ErrorBoundaryProps {
  children?: ReactNode;
  onBack: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <LanguageContext.Consumer>
          {(context) => {
            const t = context?.t;
            // Fallback text if context is missing (shouldn't happen inside provider)
            const title = t?.errorTitle || "Unexpected Error";
            const msg = t?.errorGeneric || "An unexpected error occurred.";
            const retryText = t?.retry || "Retry";
            const backText = t?.goBack || "Go Back";

            return (
              <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 animate-fade-in">
                <div className="bg-slate-900 border border-red-900/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                  
                  <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-slate-400 mb-6 text-sm">
                    {this.state.error?.message || msg}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={this.handleRetry}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition-colors"
                    >
                      {retryText}
                    </button>
                    <button
                      onClick={this.props.onBack}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-lg transition-colors"
                    >
                      {backText}
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        </LanguageContext.Consumer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;