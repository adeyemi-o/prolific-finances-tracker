
import React, { Suspense } from 'react';
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Router from "@/router";
import Loading from "@/components/ui/loading";

// Optimized Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      suspense: true, // Enable suspense mode for better loading states
      networkMode: 'offlineFirst', // Prioritize cached data first
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Suspense fallback={<Loading fullScreen text="Loading application..." />}>
              <Router />
              <Toaster position="top-right" />
            </Suspense>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
