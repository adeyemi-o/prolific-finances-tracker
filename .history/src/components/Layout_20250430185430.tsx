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
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      {/* Apply padding-left based on sidebar state */}
      <main className={cn(
        "flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-out",
        // Adjust left margin based on sidebar state for desktop
        !isMobile && (sidebarOpen ? "md:ml-64" : "md:ml-16"),
        // Add padding top for mobile header
        isMobile && "pt-14" 
      )}>
        {/* Add inner padding to the content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
        <Toaster />
      </main>
    </div>
  );
};

export default Layout;
