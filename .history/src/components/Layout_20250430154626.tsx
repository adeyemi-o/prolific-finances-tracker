import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Toggle sidebar function for mobile view
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main layout with responsive padding and overflow handling */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-2 px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
