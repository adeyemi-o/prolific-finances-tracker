import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const wasDesktop = !isMobile;
      if (wasDesktop) {
        // Optionally close on resize to mobile
      }
    } else if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className={cn(
      "flex min-h-screen bg-background"
    )}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main content area */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isMobile ? "mt-16" : "",
        !isMobile && sidebarOpen ? "ml-64" : "",
        !isMobile && !sidebarOpen ? "ml-16" : ""
      )}>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Layout;
