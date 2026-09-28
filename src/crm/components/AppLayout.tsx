import { SidebarProvider, SidebarTrigger } from "@/crm/components/ui/sidebar";
import { AppSidebar } from "@/crm/components/AppSidebar";
import { Search } from "lucide-react";
import { Input } from "@/crm/components/ui/input";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AppLayout({ children, title, subtitle, actions }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b bg-card shrink-0">
            <div className="min-h-20 py-3 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                {title && (
                  <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs md:text-sm font-bold text-muted-foreground/80 mt-0.5">{subtitle}</p>}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates, jobs..."
                    className="h-8 w-64 pl-8 text-xs bg-secondary border-0 focus-visible:ring-1"
                  />
                </div>
              </div>
            </div>
            {actions && (
              <div className="flex items-center justify-end gap-2 px-4 pb-3 flex-wrap">
                {actions}
              </div>
            )}
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
