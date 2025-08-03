import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  console.log('AppShell rendering with children:', children);
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header with sidebar trigger */}
            <header className="h-16 border-b border-primary/20 glass-strong flex items-center px-6">
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SidebarTrigger>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
}