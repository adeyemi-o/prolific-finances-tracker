import { NavLink } from "react-router-dom";
import { 
  ChartPie, 
  FileText, 
  Users, 
  BarChartHorizontal, // New icon for Reports
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
          "fixed top-0 left-0 right-0 z-30 h-14 px-4 flex items-center justify-between bg-background/90 backdrop-blur-lg transition-all duration-300",
          isScrolled ? "border-b border-border/50 shadow-sm" : "border-b border-transparent"
        )}>
          <button
            onClick={onToggle}
            className="p-2 -m-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <img
              src="/prolific-homecare-logo.png"
              alt="Prolific Homecare"
              className="h-7 w-auto"
            />
          </div>
          
          <ThemeToggle />
        </div>
      )}

      {/* Main sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-background border-r border-border transition-all duration-300 ease-out shadow-xl",
          isMobile && !isOpen && "transform -translate-x-full",
          isMobile && isOpen && "transform translate-x-0",
          !isMobile && "transform-none",
          !isMobile && !isOpen && "w-16",
          !isMobile && isOpen && "w-64"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar header */}
          <div className="border-b border-border/80">
            <div className={cn(
              "px-3 py-3 flex items-center justify-between transition-all duration-300 ease-out",
              !isMobile && !isOpen && "px-2 py-3"
            )}>
              <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                <img
                  src="/prolific-homecare-logo.png"
                  alt="Prolific Homecare"
                  className={cn(
                    "h-8 w-auto flex-shrink-0 transition-all duration-300 ease-out",
                    !isMobile && !isOpen && "h-7"
                  )}
                />
                <span className={cn(
                  "text-primary font-semibold whitespace-nowrap transition-opacity duration-200 ease-out",
                  (!isMobile && !isOpen) && "opacity-0 pointer-events-none"
                )}>
                  Financial Tracker
                </span>
              </div>
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onToggle}
                    className="rounded-full h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                    aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                  >
                    <ChevronsLeft className={cn(
                      "h-4 w-4 transition-transform duration-300 ease-out",
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
                    className="lg:hidden p-2 -m-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation section */}
          <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
            <nav className="grid gap-1 px-2">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                  "hover:bg-accent/80 active:scale-[0.98]",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground hover:text-accent-foreground",
                  (!isMobile && !isOpen) && "justify-center px-0 w-12 h-12"
                )}
                onClick={isMobile ? onToggle : undefined}
                title={(!isMobile && !isOpen) ? "Dashboard" : undefined}
              >
                <ChartPie className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200 ease-out",
                  (!isMobile && !isOpen) && "sr-only"
                )}>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                  "hover:bg-accent/80 active:scale-[0.98]",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground hover:text-accent-foreground",
                  (!isMobile && !isOpen) && "justify-center px-0 w-12 h-12"
                )}
                onClick={isMobile ? onToggle : undefined}
                title={(!isMobile && !isOpen) ? "Transactions" : undefined}
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200 ease-out",
                  (!isMobile && !isOpen) && "sr-only"
                )}>Transactions</span>
              </NavLink>
              
              <NavLink 
                to="/reports" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                  "hover:bg-accent/80 active:scale-[0.98]",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground hover:text-accent-foreground",
                  (!isMobile && !isOpen) && "justify-center px-0 w-12 h-12"
                )}
                onClick={isMobile ? onToggle : undefined}
                title={(!isMobile && !isOpen) ? "Reports" : undefined}
              >
                <BarChartHorizontal className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-200 ease-out",
                  (!isMobile && !isOpen) && "sr-only"
                )}>Reports</span>
              </NavLink>
              
              {user?.role === 'Admin' && (
                <NavLink 
                  to="/user-management" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-out",
                    "hover:bg-accent/80 active:scale-[0.98]",
                    isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground hover:text-accent-foreground",
                    (!isMobile && !isOpen) && "justify-center px-0 w-12 h-12"
                  )}
                  onClick={isMobile ? onToggle : undefined}
                  title={(!isMobile && !isOpen) ? "User Management" : undefined}
                >
                  <Users className="h-5 w-5 flex-shrink-0" />
                  <span className={cn(
                    "transition-opacity duration-200 ease-out",
                    (!isMobile && !isOpen) && "sr-only"
                  )}>User Management</span>
                </NavLink>
              )}
            </nav>
          </div>
          
          {/* Footer with user profile */}
          <div className={cn(
            "mt-auto border-t border-border/80 p-3 transition-all duration-300 ease-out",
            (!isMobile && !isOpen) && "p-2"
          )}>
            <div className={cn(
              "flex flex-col space-y-3",
              (!isMobile && !isOpen) && "items-center space-y-2"
            )}>
              <div className={cn(
                "flex items-center gap-2 w-full",
                (!isMobile && !isOpen) && "flex-col gap-1"
              )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={cn(
                  "flex-1 min-w-0 transition-opacity duration-200 ease-out",
                  (!isMobile && !isOpen) && "opacity-0 pointer-events-none hidden"
                )}>
                  <p className="text-sm font-medium truncate">{user?.role || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost"
                size={(!isMobile && !isOpen) ? "icon" : "sm"}
                className={cn(
                  "w-full flex items-center justify-center gap-2 transition-all duration-200 ease-out text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                  (!isMobile && !isOpen) && "w-10 h-10 p-0 rounded-md"
                )}
                onClick={handleLogout}
                title={(!isMobile && !isOpen) ? "Sign out" : undefined}
              >
                <LogOut className={cn("h-4 w-4", (!isMobile && !isOpen) && "h-5 w-5")} />
                <span className={cn(
                  (!isMobile && !isOpen) && "sr-only"
                )}>Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
