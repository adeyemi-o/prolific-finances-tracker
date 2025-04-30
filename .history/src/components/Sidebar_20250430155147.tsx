import { NavLink } from "react-router-dom";
import { 
  ChartPie, 
  FileText, 
  Users, 
  Calendar, 
  Menu,
  X,
  LogOut,
  ChevronRight
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

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const isDesktop = useDesktop();

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
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Hamburger menu for mobile - fixed position for visibility */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-md shadow-md hover:bg-accent/80 transition-colors duration-200"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Main sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[280px] sm:w-[300px] bg-background border-r border-border transition-all duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          !isMobile && !isOpen && "-translate-x-full",
          (isMobile || isTablet) && "shadow-xl",
          !isOpen && "duration-500"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-border py-3">
            <div className="px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/prolific-homecare-logo.png"
                  alt="Prolific Homecare"
                  className="h-8 w-auto"
                />
                <span className="text-primary font-bold whitespace-nowrap tracking-tight text-lg">
                  Financial Tracker
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onToggle}
                  className="h-8 w-8 hover:bg-accent/80 transition-colors"
                  aria-label="Close sidebar"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <nav className="grid gap-1.5">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent group transition-all duration-200 ease-in-out",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <ChartPie className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent group transition-all duration-200 ease-in-out",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <FileText className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Transactions</span>
              </NavLink>
              
              <NavLink 
                to="/reports" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent group transition-all duration-200 ease-in-out",
                  isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <Calendar className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span>Reports</span>
              </NavLink>
              
              {user?.role === 'Admin' && (
                <NavLink 
                  to="/user-management" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent group transition-all duration-200 ease-in-out",
                    isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-foreground"
                  )}
                  onClick={isMobile ? onToggle : undefined}
                >
                  <Users className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>User Management</span>
                </NavLink>
              )}
            </nav>
          </div>
          
          <div className="mt-auto border-t border-border p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.role || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full flex items-center justify-center gap-2 hover:bg-accent/80 transition-all duration-200" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty div to push content when sidebar is open */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 transition-all duration-300 ease-in-out",
          isOpen ? "w-[280px] sm:w-[300px]" : "w-0",
          isMobile && "w-0" // Always 0 for mobile as we push content down instead
        )}
      />

      {/* Fixed hamburger toggle for non-mobile views */}
      {!isMobile && (
        <div 
          className={cn(
            "fixed z-50 transition-all duration-300 ease-in-out",
            isOpen ? "left-[280px] sm:left-[300px]" : "left-4",
            "top-4"
          )}
        >
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggle}
            className="h-9 w-9 rounded-md shadow-md hover:bg-accent/80 border border-border bg-background/80 backdrop-blur-sm transition-transform hover:scale-105"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
