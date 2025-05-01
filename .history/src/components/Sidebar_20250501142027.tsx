import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, // Changed from ChartPie for consistency
  FileText, 
  Users, 
  BarChart3, // Added for Reports
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
  const { user, logout, loading } = useAuth();
  console.log("Sidebar user:", user);
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
      {/* Mobile top bar */}
      {isMobile && (
        <div className={cn(
          "fixed top-0 left-0 right-0 z-30 h-16 px-4 flex items-center justify-between bg-background/90 backdrop-blur-lg transition-shadow duration-200",
          isScrolled ? "shadow-sm border-b border-border/50" : ""
        )}>
          <button
            onClick={onToggle}
            className="p-2 -ml-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors touch-target"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-transform duration-300 ease-in-out",
          isMobile ? "w-72" : "",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0 shadow-xl",
          !isMobile && "shadow-sm",
          !isMobile && isOpen && "w-64 translate-x-0",
          !isMobile && !isOpen && "w-16 translate-x-0"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar header */}
          <div className="border-b border-border/80">
            <div className={cn(
              "px-3 h-16 flex items-center justify-between transition-all duration-300",
              !isMobile && !isOpen && "px-2 justify-center"
            )}>
              <div className={cn(
                "flex items-center gap-2 overflow-hidden",
                !isMobile && !isOpen && "gap-0"
              )}>
                <img
                  src="/prolific-homecare-logo.png"
                  alt="Prolific Homecare"
                  className={cn(
                    "h-8 w-auto flex-shrink-0 transition-all duration-300",
                    !isMobile && !isOpen && "h-7"
                  )}
                />
                <span className={cn(
                  "text-lg font-semibold text-primary whitespace-nowrap transition-opacity duration-200 delay-100",
                  (!isMobile && !isOpen) && "opacity-0 w-0"
                )}>
                  FinTrack
                </span>
              </div>
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onToggle}
                  className={cn(
                    "rounded-full h-7 w-7 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300",
                    !isOpen && "rotate-180"
                  )}
                  aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              )}
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onToggle}
                  className="lg:hidden h-8 w-8 -mr-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Navigation section */}
          <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
            <nav className="grid gap-1 px-2">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => cn(
                  "nav-item group",
                  isActive && "nav-item-active"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <LayoutDashboard className="nav-item-icon" />
                <span className={cn(
                  "nav-item-text",
                  (!isMobile && !isOpen) && "nav-item-text-collapsed"
                )}>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => cn(
                  "nav-item group",
                  isActive && "nav-item-active"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <FileText className="nav-item-icon" />
                <span className={cn(
                  "nav-item-text",
                  (!isMobile && !isOpen) && "nav-item-text-collapsed"
                )}>Transactions</span>
              </NavLink>
              
              <NavLink 
                to="/reports" 
                className={({ isActive }) => cn(
                  "nav-item group",
                  isActive && "nav-item-active"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <BarChart3 className="nav-item-icon" />
                <span className={cn(
                  "nav-item-text",
                  (!isMobile && !isOpen) && "nav-item-text-collapsed"
                )}>Reports</span>
              </NavLink>
              
              {!loading && user?.role === 'Admin' && (
                <NavLink 
                  to="/user-management" 
                  className={({ isActive }) => cn(
                    "nav-item group",
                    isActive && "nav-item-active"
                  )}
                  onClick={isMobile ? onToggle : undefined}
                >
                  <Users className="nav-item-icon" />
                  <span className={cn(
                    "nav-item-text",
                    (!isMobile && !isOpen) && "nav-item-text-collapsed"
                  )}>User Management</span>
                </NavLink>
              )}
            </nav>
          </div>
          
          {/* Footer with user profile & logout */}
          <div className={cn(
            "mt-auto border-t border-border/80 p-3",
            (!isMobile && !isOpen) && "p-2"
          )}>
            <div className={cn(
              "flex items-center justify-between",
              (!isMobile && !isOpen) && "flex-col gap-2"
            )}>
              <div className={cn(
                "flex items-center gap-2 min-w-0",
                (!isMobile && !isOpen) && "flex-col text-center"
              )}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={cn(
                  "flex-1 min-w-0",
                  (!isMobile && !isOpen) && "hidden"
                )}>
                  <p className="text-sm font-medium truncate">{user?.email || 'User Email'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.role || 'Role'}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size={(!isMobile && !isOpen) ? "icon" : "sm"}
                onClick={handleLogout}
                className={cn(
                  "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                  (!isMobile && !isOpen) ? "h-8 w-8" : "gap-2"
                )}
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                <span className={cn((!isMobile && !isOpen) && "hidden")}>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Desktop collapsed state spacer */}
      {!isMobile && (
        <div className={cn(
          "hidden md:block transition-all duration-300",
          isOpen ? "w-64" : "w-16"
        )}></div>
      )}
    </>
  );
};

export default Sidebar;
