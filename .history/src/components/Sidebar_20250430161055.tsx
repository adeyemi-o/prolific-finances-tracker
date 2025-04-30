import { NavLink } from "react-router-dom";
import { 
  ChartPie, 
  FileText, 
  Users, 
  Calendar, 
  Menu,
  X,
  LogOut,
  ChevronsLeft
} from "lucide-react";
import { 
  Sidebar as SidebarComponent,
  SidebarContent, 
  SidebarFooter,
  SidebarHeader, 
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile, useTablet, useDesktop } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isDesktop = useDesktop();
  const [isScrolled, setIsScrolled] = useState(false);

  // Check scroll position for mobile header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Mobile top bar for hamburger and logo - always visible on mobile */}
      {isMobile && (
        <div className={cn(
          "fixed top-0 left-0 right-0 z-30 h-14 px-4 flex items-center justify-between bg-background/80 backdrop-blur-md transition-all duration-200",
          isScrolled ? "border-b shadow-sm" : ""
        )}>
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <img
              src="/prolific-homecare-logo.png"
              alt="Prolific Homecare"
              className="h-8 w-auto"
            />
          </div>
          
          <ThemeToggle />
        </div>
      )}

      {/* Main sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out shadow-lg",
          isMobile && !isOpen && "transform -translate-x-full",
          isMobile && isOpen && "transform translate-x-0",
          !isMobile && !isOpen && "transform -translate-x-full md:w-16 md:translate-x-0",
          !isMobile && isOpen && "transform translate-x-0"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar header */}
          <div className="border-b border-border">
            <div className="px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <img
                  src="/prolific-homecare-logo.png"
                  alt="Prolific Homecare"
                  className="h-8 w-auto flex-shrink-0"
                />
                <span className={cn(
                  "text-primary font-bold whitespace-nowrap transition-opacity duration-200",
                  (!isMobile && !isOpen) && "opacity-0"
                )}>
                  Financial Tracker
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onToggle}
                    className="rounded-full h-8 w-8 transition-transform duration-200"
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                  >
                    <ChevronsLeft className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      !isOpen && "rotate-180"
                    )} />
                  </Button>
                )}
                {!isMobile && isOpen && <ThemeToggle />}
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onToggle}
                    className="lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation section */}
          <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
            <nav className="grid gap-1 px-2">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                  (!isMobile && !isOpen) && "justify-center px-2"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <ChartPie className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200",
                  (!isMobile && !isOpen) && "hidden md:hidden"
                )}>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                  (!isMobile && !isOpen) && "justify-center px-2"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200",
                  (!isMobile && !isOpen) && "hidden md:hidden"
                )}>Transactions</span>
              </NavLink>
              
              <NavLink 
                to="/reports" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                  (!isMobile && !isOpen) && "justify-center px-2"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <Calendar className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200",
                  (!isMobile && !isOpen) && "hidden md:hidden"
                )}>Reports</span>
              </NavLink>
              
              {user?.role === 'Admin' && (
                <NavLink 
                  to="/user-management" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                    "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground",
                    (!isMobile && !isOpen) && "justify-center px-2"
                  )}
                  onClick={isMobile ? onToggle : undefined}
                >
                  <Users className="h-5 w-5 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200",
                    (!isMobile && !isOpen) && "hidden md:hidden"
                  )}>User Management</span>
                </NavLink>
              )}
            </nav>
          </div>
          
          {/* Footer with user profile */}
          <div className={cn(
            "mt-auto border-t border-border p-4 transition-all duration-300",
            (!isMobile && !isOpen) && "p-2"
          )}>
            <div className={cn(
              "flex flex-col space-y-4",
              (!isMobile && !isOpen) && "items-center"
            )}>
              <div className={cn(
                "flex items-center gap-2",
                (!isMobile && !isOpen) && "flex-col"
              )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={cn(
                  "flex-1 min-w-0",
                  (!isMobile && !isOpen) && "hidden"
                )}>
                  <p className="text-sm font-medium truncate">{user?.role || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size={(!isMobile && !isOpen) ? "icon" : "sm"}
                className={cn(
                  "w-full flex items-center justify-center gap-2 transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20",
                  (!isMobile && !isOpen) && "w-8 h-8 p-0"
                )}
                onClick={handleLogout}
              >
                <LogOut className={cn("h-4 w-4", (!isMobile && !isOpen) && "h-4 w-4")} />
                <span className={cn(
                  (!isMobile && !isOpen) && "hidden"
                )}>Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Padding div for non-mobile view to push content */}
      {!isMobile && (
        <div className={cn(
          "hidden md:block transition-all duration-300",
          isOpen ? "w-64" : "w-16"
        )}></div>
      )}

      {/* Floating desktop-only toggle button when sidebar is collapsed */}
      {!isMobile && !isOpen && (
        <div className={cn(
          "fixed top-4 left-[68px] z-40 transition-all duration-200",
          isDesktop ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggle}
            className="h-8 w-8 rounded-full border border-border bg-background/80 backdrop-blur-sm shadow-md transition-transform duration-200 hover:scale-105"
            aria-label="Expand sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
