import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  FileText, 
  Users, 
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { 
  Sidebar as SidebarComponent,
  SidebarContent, 
  SidebarFooter,
  SidebarHeader, 
  SidebarInset,
  SidebarWrapper,
  SidebarProvider
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile, useTablet } from "@/hooks/use-mobile";
import { useState, useEffect, useRef } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    label: "Transactions",
    icon: FileText,
    to: "/transactions",
  },
  {
    label: "Reports",
    icon: BarChart3,
    to: "/reports",
  },
  {
    label: "User Management",
    icon: Users,
    to: "/user-management",
  },
];

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { user, logout, loading } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  // Check for desktop size using similar approach as the hooks
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024 && window.innerWidth < 1280);
    };
    
    window.addEventListener('resize', checkDesktop);
    checkDesktop();
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

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

  const displayName = (user && user.raw_user_meta_data?.display_name) || user?.email || 'User';

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
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 ease-in-out",
          "backdrop-blur-xl bg-white/10 dark:bg-neutral-900/60 shadow-2xl rounded-xl m-2",
          isMobile ? "w-72" : collapsed ? "w-20" : "w-64",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0",
          !isMobile && "shadow-xl"
        )}
        style={{ minHeight: 'calc(100vh - 1rem)' }}
      >
        {/* Company Logo */}
        <div className="flex flex-col items-center pt-6 pb-2 px-4">
                <img
                  src="/prolific-homecare-logo.png"
            alt="Prolific Homecare Logo"
            className={cn("h-12 w-auto mb-2 transition-all duration-300", collapsed && "h-10")}
          />
        </div>
        {/* Profile Section */}
        <div className={cn("flex flex-col items-center gap-2 pb-4 px-4 border-b border-white/10 transition-all duration-300", collapsed && "pb-2")}> 
          <div className="h-14 w-14 rounded-full object-cover border-2 border-white/20 shadow bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
                <span className={cn(
            "font-semibold text-lg truncate max-w-[140px] transition-all duration-300",
            collapsed ? "text-xs max-w-[32px] text-neutral-900 dark:text-white" : "text-neutral-900 dark:text-white"
                )}>
            {displayName}
                </span>
          {!collapsed && (
            <span className="text-sm text-neutral-500 dark:text-white/80">Hello 👋</span>
              )}
            </div>
        {/* Collapse/Expand Toggle (desktop/tablet only) */}
        {!isMobile && (
          <button
            className="flex items-center justify-center mx-auto my-2 p-2 rounded-full bg-white/20 hover:bg-white/30 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
            {collapsed ? <ChevronsRight className="h-5 w-5 text-white" /> : <ChevronsLeft className="h-5 w-5 text-white" />}
          </button>
        )}
        {/* Menu Section */}
        <nav className="flex-1 flex flex-col gap-1 py-4 px-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isUserManagement = item.label === "User Management";
            return (
              <div key={item.label} className="relative group">
              <NavLink 
                  to={isUserManagement ? "#" : item.to}
                className={({ isActive }) => cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all relative",
                    collapsed ? "justify-center" : "justify-start",
                    "hover:bg-neutral-100 dark:hover:bg-white/10",
                    isActive && !isUserManagement && "bg-neutral-200 dark:bg-white/10 text-primary dark:text-white",
                    !isActive && "text-neutral-900 dark:text-white",
                    isUserManagement && "opacity-50 pointer-events-none cursor-not-allowed"
                )}
                onClick={isMobile ? onToggle : undefined}
                  tabIndex={isUserManagement ? -1 : 0}
                  aria-disabled={isUserManagement}
              >
                  <item.icon className="h-5 w-5 mr-2" />
                  {(!collapsed || isMobile) && <span className="flex-1 text-left">{item.label}</span>}
              </NavLink>
                {/* Active indicator bar */}
                <span className={cn(
                  "absolute left-0 top-2 bottom-2 w-1 rounded-full bg-green-400 transition-all",
                  window.location.pathname === item.to && !isUserManagement && "opacity-100"
                )} />
              </div>
            );
          })}
          {user?.role === "Admin" && (
            <div className="relative group">
              <NavLink
                to="/audit-logs"
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all relative",
                  collapsed ? "justify-center" : "justify-start",
                  "hover:bg-neutral-100 dark:hover:bg-white/10",
                  isActive && "bg-neutral-200 dark:bg-white/10 text-primary dark:text-white",
                  !isActive && "text-neutral-900 dark:text-white"
                )}
                onClick={isMobile ? onToggle : undefined}
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {(!collapsed || isMobile) && <span className="flex-1 text-left">Audit Logs</span>}
              </NavLink>
              {/* Active indicator bar */}
              <span className={cn(
                "absolute left-0 top-2 bottom-2 w-1 rounded-full bg-green-400 transition-all",
                window.location.pathname === "/audit-logs" && "opacity-100"
              )} />
            </div>
          )}
        </nav>
        {/* Footer with logout and theme toggle */}
        <div className="flex flex-col items-center gap-2 py-4 border-t border-white/10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size={isOpen ? "sm" : "icon"}
                onClick={handleLogout}
                className="text-neutral-900 dark:text-white hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-500"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
                {isOpen && <span className="ml-2">Logout</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">Logout</TooltipContent>
          </Tooltip>
          <ThemeToggle />
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
          isOpen ? "w-64" : "w-20"
        )}></div>
      )}
    </>
  );
};

export default Sidebar;
