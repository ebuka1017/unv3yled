import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  User,
  Sparkles,
  Music,
  Users,
  Bookmark,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Chat", href: "/dashboard", icon: MessageSquare },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Recommendations", href: "/recommendations", icon: Sparkles },
  { name: "Spotify", href: "/spotify", icon: Music },
  { name: "Taste Twins", href: "/friends", icon: Users },
  { name: "Saved", href: "/saved", icon: Bookmark },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Sidebar className="border-r border-primary/20 glass-strong">
      <SidebarHeader className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-2xl bg-primary/20 flex items-center justify-center shimmer">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gradient bg-gradient-primary bg-clip-text text-transparent">
                unv3iled
              </h1>
              <p className="text-xs text-muted-foreground">AI Taste Companion</p>
            </div>
          )}
        </motion.div>

        {/* User Info */}
        {user && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 glass rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
          </motion.div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild className="h-11">
                    <NavLink
                      to={item.href}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-3xl transition-all duration-300 group hover-lift ${
                          navIsActive || isActive(item.href)
                            ? "bg-primary/20 text-primary shadow-lg"
                            : "hover:bg-card/80"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-sm font-medium">
                            {item.name}
                          </span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 h-11 rounded-3xl hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}