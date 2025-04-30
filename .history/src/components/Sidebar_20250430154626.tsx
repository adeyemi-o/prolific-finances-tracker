import { NavLink } from "react-router-dom";
import { 
  ChartPie, 
  FileText, 
  Users, 
  Calendar, 
  Menu,
  X,
  LogOut
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
import { useMobile } from "@/hooks/use-mobile";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();

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
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Hamburger menu for mobile - fixed position for visibility */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md shadow-sm"
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
          "fixed inset-y-0 left-0 z-40 w-64 bg-background transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && "shadow-xl"
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-border py-3">
            <div className="px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/prolific-homecare-logo.png"
                  alt="Prolific Homecare"
                  className="h-8 w-auto"
                />
                <span className="text-primary font-bold whitespace-nowrap">
                  Financial Tracker
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
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
          
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="grid gap-1 px-2">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <ChartPie className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <FileText className="h-5 w-5" />
                <span>Transactions</span>
              </NavLink>
              
              <NavLink 
                to="/reports" 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <Calendar className="h-5 w-5" />
                <span>Reports</span>
              </NavLink>
              
              {user?.role === 'Admin' && (
                <NavLink 
                  to="/user-management" 
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                  )}
                  onClick={isMobile ? onToggle : undefined}
                >
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </NavLink>
              )}
            </nav>
          </div>
          
          <div className="mt-auto border-t border-border p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Padding div for non-mobile view to push content */}
      {!isMobile && (
        <div className="w-64 flex-shrink-0"></div>
      )}

      {/* Desktop-only hamburger toggle */}
      {!isMobile && (
        <div className="fixed top-4 left-[276px] z-50">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onToggle}
            className="h-8 w-8"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;
