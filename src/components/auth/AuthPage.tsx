import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Music, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const { signInWithSpotify, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSpotifyConnect = async () => {
    setIsConnecting(true);
    try {
      await signInWithSpotify();
    } catch (error) {
      console.error('Auth error:', error);
      setIsConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center mb-4 shimmer">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-transparent bg-gradient-bubblegum bg-clip-text">
            Welcome to Cortex
          </CardTitle>
          <CardDescription>
            Your AI-powered cultural discovery companion
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Connect your Spotify account to get started with personalized recommendations
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Discover music, movies, books & more</li>
              <li>• Find taste twins with similar preferences</li>
              <li>• Get AI-powered cultural insights</li>
            </ul>
          </div>

          <Button 
            onClick={handleSpotifyConnect}
            disabled={isConnecting}
            className="w-full pill-button text-lg py-6"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Music className="w-5 h-5 mr-2" />
                Continue with Spotify
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We only access your music preferences to provide better recommendations. 
            Your personal data remains private.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}