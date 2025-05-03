import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Router from "@/router";

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
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounting after the component has rendered on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ErrorBoundary>
      {mounted ? (
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
      ) : (
        <div>Loading application...</div>
      )}
    </ErrorBoundary>
  );
}

export default App;