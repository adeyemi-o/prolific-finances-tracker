import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Router from "@/router";
import TestComponent from './components/TestComponent';

const queryClient = new QueryClient();

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error details</summary>
            {this.state.error && this.state.error.toString()}
          </details>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '10px', padding: '5px 10px' }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // State to control which components to show
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Auto-advance to next step after seeing each works
    const timer = setTimeout(() => {
      if (step < 5) {
        setStep(step + 1);
      }
    }, 5000); // 5 seconds per step
    return () => clearTimeout(timer);
  }, [step]);
  
  return (
    <div>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: '#f0f0f0', 
        padding: '10px', 
        zIndex: 9999,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Testing App Structure - Step {step}</h2>
        <div>
          <button onClick={() => setStep(Math.max(0, step - 1))} style={{ marginRight: '10px' }}>Previous</button>
          <button onClick={() => setStep(Math.min(5, step + 1))}>Next</button>
        </div>
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <ErrorBoundary>
          {step === 0 && (
            <TestComponent />
          )}
          
          {step === 1 && (
            <BrowserRouter>
              <TestComponent />
            </BrowserRouter>
          )}
          
          {step === 2 && (
            <BrowserRouter>
              <ThemeProvider>
                <TestComponent />
              </ThemeProvider>
            </BrowserRouter>
          )}
          
          {step === 3 && (
            <BrowserRouter>
              <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                  <TestComponent />
                </QueryClientProvider>
              </ThemeProvider>
            </BrowserRouter>
          )}
          
          {step === 4 && (
            <BrowserRouter>
              <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                  <AuthProvider>
                    <TestComponent />
                  </AuthProvider>
                </QueryClientProvider>
              </ThemeProvider>
            </BrowserRouter>
          )}
          
          {step === 5 && (
            <BrowserRouter>
              <ThemeProvider>
                <QueryClientProvider client={queryClient}>
                  <AuthProvider>
                    <Router />
                    <Toaster position="top-right" />
                  </AuthProvider>
                </QueryClientProvider>
              </ThemeProvider>
            </BrowserRouter>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;