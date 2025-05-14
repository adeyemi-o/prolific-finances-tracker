import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { SidebarWrapper, SidebarProvider } from "@/components/ui/sidebar";
import Loading from "@/components/ui/loading";
import { useLocation } from "react-router-dom";
import Footer from "@/components/ui/footer";

const Layout = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  // Initialize sidebarOpen directly based on the initial isMobile value
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    // If the screen becomes mobile, close the sidebar.
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  // Add a small delay to ensure layout is stable before showing content
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <SidebarProvider>
      <SidebarWrapper className={cn(
        "flex min-h-screen bg-background overflow-hidden" // Add overflow-hidden
      )}>
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content area */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out flex flex-col", // Make main a flex column
          isMobile ? "mt-16" : ""
        )}>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col">
            {isLoading ? (
              <Loading text="Loading content..." />
            ) : (
              <Outlet />
            )}
          </div>
          <Footer />
        </main>
        
        <Toaster position="bottom-right" />
      </SidebarWrapper>
    </SidebarProvider>
  );
};

export default Layout;
