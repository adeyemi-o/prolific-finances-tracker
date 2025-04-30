
import { NavLink } from "react-router-dom";
import { 
  ChartPie, 
  FileText, 
  Users, 
  Calendar, 
  Menu,
  LogOut
} from "lucide-react";
import { 
  Sidebar as SidebarComponent,
  SidebarContent, 
  SidebarFooter,
  SidebarHeader, 
  SidebarTrigger, 
  SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SidebarComponent collapsible="icon">
          <SidebarHeader className="border-b border-border py-3">
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
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="overflow-y-auto">
            <nav className="grid gap-1 px-2 py-4">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-foreground"
                )}
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
                >
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </NavLink>
              )}
            </nav>
          </SidebarContent>
          
          <SidebarFooter className="mt-auto border-t border-border p-4">
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
          </SidebarFooter>
        </SidebarComponent>

        <SidebarInset>
          <div className="p-4 flex items-center">
            <SidebarTrigger className="mr-4">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Sidebar;
