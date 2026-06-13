import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  KanbanSquare,
  Settings,
  LogOut,
  Phone,
  BarChart3,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { NavLink } from "@/crm/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/crm/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/crm/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/crm/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/dashboard/crm", icon: LayoutDashboard, permission: "dashboard_view" },
  { title: "Candidates", url: "/dashboard/crm/candidates", icon: Users, permission: "candidate_view" },
  { title: "Assignment & Performance", url: "/dashboard/crm/assignment-performance", icon: ClipboardList, roleRestricted: true },
  { title: "Jobs", url: "/dashboard/crm/jobs", icon: Briefcase, permission: "job_view" },
  { title: "Clients", url: "/dashboard/crm/clients", icon: Building2, permission: "client_view" },
  { title: "Reports", url: "/dashboard/crm/reports", icon: BarChart3, permission: "reports_view" },
];

const secondaryNav = [
  { title: "Calling Portal", url: "/dashboard/crm/calling-portal", icon: Phone, permission: "interview_view" },
  { title: "Pipeline", url: "/dashboard/crm/pipeline", icon: KanbanSquare, permission: "application_view" },
  { title: "Communications", url: "/dashboard/crm/communications", icon: MessageSquare, permission: "settings_view" },
  { title: "Settings", url: "/dashboard/crm/settings", icon: Settings, permission: "settings_view" },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/dashboard/crm"), 600);
  };

  const isPathActive = (url: string) => {
    if (url === "/dashboard/crm") {
      return location.pathname === url;
    }
    return location.pathname.startsWith(url);
  };

  const hasPermission = (perm?: string) => {
    if (!perm) return true;
    if (!user) return false;
    
    const userPerms = (user as any).permissions || [];
    
    // Parse if permissions is a JSON string
    let parsedPerms: string[] = [];
    if (Array.isArray(userPerms)) {
      parsedPerms = userPerms;
    } else if (typeof userPerms === "string") {
      try {
        parsedPerms = JSON.parse(userPerms);
      } catch (e) {
        parsedPerms = [];
      }
    }
    
    return parsedPerms.includes("*") || parsedPerms.includes(perm);
  };

  const visibleMainNav = mainNav.filter(item => {
    if (item.roleRestricted) {
      return user?.role === "manager" || user?.role === "admin" || user?.role === "super-admin";
    }
    return hasPermission(item.permission);
  });
  const visibleSecondaryNav = secondaryNav.filter(item => hasPermission(item.permission));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
            J
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">Job Mela Admin</span>
              <span className="text-xs text-sidebar-foreground">Staffing Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        {visibleMainNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
              {!collapsed && "Main"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleMainNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isPathActive(item.url)}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard/crm"}
                        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {visibleSecondaryNav.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60">
              {!collapsed && "Tools"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleSecondaryNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isPathActive(item.url)}
                    >
                      <NavLink
                        to={item.url}
                        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md p-1 hover:bg-sidebar-accent transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium uppercase">
                {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </div>
              {!collapsed && (
                <div className="flex flex-1 flex-col items-start overflow-hidden">
                  <span className="text-xs font-medium text-sidebar-accent-foreground truncate w-full">
                    {user?.name || 'CRM User'}
                  </span>
                  <span className="text-[10px] text-sidebar-foreground truncate w-full">
                    {user?.email || 'user@jobmela.com'}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="text-xs">Admin User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/crm/settings")} className="text-xs gap-2">
              <Settings className="h-3.5 w-3.5" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-xs gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-3.5 w-3.5" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
