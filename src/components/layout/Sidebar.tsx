import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  MessageCircle, 
  User, 
  Heart, 
  Settings,
  Sparkles,
  Music,
  Users
} from "lucide-react";

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Taste Profile", href: "/profile", icon: User },
  { name: "Recommendations", href: "/recommendations", icon: Sparkles },
  { name: "Spotify Sync", href: "/spotify", icon: Music },
  { name: "Taste Twins", href: "/friends", icon: Users },
  { name: "Saved", href: "/saved", icon: Heart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 glass-strong border-r border-white/10 p-6 flex flex-col"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-neural bg-gradient-neural bg-clip-text text-transparent">
          Cortex
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          AI Taste Companion
        </p>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
            >
              <Link
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-neural text-white shadow-neural"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-text-muted group-hover:text-text-primary"
                  )}
                />
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="pt-6 border-t border-white/10"
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-neural flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Neural Mode</p>
              <p className="text-xs text-text-muted">Enhanced AI</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}