import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  
  // Simple test to see if basic styling works
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-primary mb-4">Dashboard Test</h1>
      
      <div className="space-y-4 mb-8">
        <div className="test-css-vars">
          <h2 className="text-2xl font-bold mb-2">CSS Variables Test</h2>
          <p>This should have a bubblegum pink background</p>
        </div>
        
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-2">Glass Card Test</h2>
          <p className="text-muted-foreground">This should have a glass effect</p>
        </div>
        
        <div className="bg-gradient-bubblegum p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">Gradient Test</h2>
          <p className="text-white">This should have a bubblegum gradient</p>
        </div>
        
        <div className="bg-primary text-primary-foreground p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Primary Color Test</h2>
          <p>This should have primary colors</p>
        </div>
      </div>
      
      <ErrorBoundary>
        <AppShell>
          <ChatInterface />
        </AppShell>
      </ErrorBoundary>
    </div>
  );
};

export default Dashboard;