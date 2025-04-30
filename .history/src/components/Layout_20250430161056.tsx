import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useMobile, useTablet, useDesktop } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isDesktop = useDesktop();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Add page load animation
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={cn(
      "flex min-h-screen overflow-hidden bg-background transition-opacity duration-500",
      isPageLoaded ? "opacity-100" : "opacity-0"
    )}>
      {/* Sidebar component */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      {/* Main content area */}
      <div 
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          isMobile && "pt-14", // Extra padding for mobile to account for fixed header
          !isMobile && sidebarOpen ? "ml-0" : "ml-0"
        )}
      >
        {/* Mobile top padding area for fixed header */}
        {isMobile && (
          <div className="h-14 w-full fixed top-0 left-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border shadow-sm">
            <div className="flex items-center h-full px-14">
              <h1 className="text-lg font-semibold truncate">
                Prolific Homecare
              </h1>
            </div>
          </div>
        )}
        
        {/* Main scrollable content */}
        <main className={cn(
          "flex-1 overflow-y-auto transition-all",
          isMobile ? "px-4 pt-4" : "px-4 sm:px-6 md:px-8 lg:px-10 pt-4"
        )}>
          <div 
            className={cn(
              "mx-auto max-w-7xl pb-10 transition-all duration-300",
              isMobile && "w-full"
            )}
          >
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Toast notifications */}
      <Toaster 
        position={isMobile ? "bottom-center" : "top-right"}
        toastOptions={{
          className: "group",
          duration: 4000
        }}
      />
    </div>
  );
};

export default Layout;
