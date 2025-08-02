import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import Landing from "./Landing";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('Dashboard Index component:', { user: !!user, loading });

  useEffect(() => {
    console.log('Auth effect:', { user: !!user, loading });
    if (!loading && !user) {
      console.log('Redirecting to auth - no user found');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    console.log('Dashboard loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, returning null');
    return null;
  }

  console.log('Rendering dashboard with user:', user.email);
  return (
    <AppShell>
      <ChatInterface />
    </AppShell>
  );
};

export default Index;