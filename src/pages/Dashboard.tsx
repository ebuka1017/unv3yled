import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log('Dashboard rendering:', { user, loading });

  useEffect(() => {
    console.log('Dashboard useEffect:', { user, loading });
    if (!loading && !user) {
      console.log('Redirecting to auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    console.log('Dashboard loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard no user state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No User Found</h1>
          <p className="text-muted-foreground mb-4">User state: {JSON.stringify({ user, loading })}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Go to Auth
          </button>
        </div>
      </div>
    );
  }

  console.log('Dashboard rendering with user:', user);
  return (
    <AppShell>
      <ChatInterface />
    </AppShell>
  );
};

export default Dashboard;