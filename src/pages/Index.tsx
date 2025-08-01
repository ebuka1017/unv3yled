import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shell } from "@/components/layout/Shell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-glass-primary to-glass-secondary">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-neural-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-primary">Loading Cortex...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <Shell>
      <ChatInterface />
    </Shell>
  );
};

export default Index;
