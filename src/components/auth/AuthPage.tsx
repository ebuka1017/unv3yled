import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Music, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function AuthPage() {
  const { signInWithSpotify, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
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

  const handleGoogleConnect = async () => {
    setIsConnectingGoogle(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google auth error:', error);
      setIsConnectingGoogle(false);
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
          <div className="flex items-center justify-between w-full mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-full p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1" />
          </div>
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
            disabled={isConnecting || isConnectingGoogle}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleConnect}
            disabled={isConnecting || isConnectingGoogle}
            variant="outline"
            className="w-full pill-button text-lg py-6"
            size="lg"
          >
            {isConnectingGoogle ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
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