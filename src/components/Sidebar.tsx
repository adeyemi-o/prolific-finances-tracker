
import { NavLink } from "react-router-dom";
import { 
  ChartPie, 
  FileText, 
  Users, 
  Calendar, 
  Menu 
} from "lucide-react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  return (
    <SidebarComponent>
      <SidebarHeader className="border-b py-6">
        <div className="px-4 flex items-center gap-2">
          <div className="text-primary font-bold text-xl">
            Prolific Homecare
          </div>
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            PH
          </div>
          <div>
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@prolific.com</p>
          </div>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
