import { motion } from "framer-motion";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 glass-strong border-b border-white/10 px-6 flex items-center justify-between"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Ask Cortex anything..."
            className="pl-10 bg-white/5 border-white/10 text-text-primary placeholder:text-text-muted focus:border-neural-purple"
          />
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
        </Button>

        {user ? (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-neural-purple/30">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-gradient-neural text-white text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary">
                {user.user_metadata?.display_name || user.email}
              </p>
              <p className="text-xs text-text-muted">Neural Active</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-text-secondary hover:text-text-primary"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-text-secondary hover:text-text-primary"
          >
            <User className="h-5 w-5" />
          </Button>
        )}
      </div>
    </motion.header>
  );
}