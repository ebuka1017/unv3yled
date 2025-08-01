import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Music, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SpotifySync() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectSpotify = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          scopes: 'user-top-read user-library-read user-read-recently-played playlist-read-private user-read-email',
          redirectTo: `${window.location.origin}/spotify`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect to Spotify. Please try again.",
        variant: "destructive",
      });
    }
  };

  const syncSpotifyData = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('spotify-sync');
      
      if (error) throw error;
      
      toast({
        title: "Sync successful",
        description: "Your Spotify data has been updated.",
      });
      
      await fetchProfile();
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync Spotify data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Spotify Integration</h1>
        <p className="text-muted-foreground">Connect and sync your Spotify data to enhance your cultural recommendations</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Connection Status
            </CardTitle>
            <CardDescription>
              Your Spotify account connection and sync status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                {profile?.spotify_connected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
              
              {profile?.spotify_connected ? (
                <Button 
                  onClick={syncSpotifyData} 
                  disabled={syncing}
                  className="pill-button"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Data
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={connectSpotify} className="pill-button">
                  <Music className="w-4 h-4 mr-2" />
                  Connect Spotify
                </Button>
              )}
            </div>

            {profile?.spotify_connected && (
              <div className="pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Account:</span>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Sync:</span>
                    <p className="text-muted-foreground">
                      {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {profile?.spotify_connected && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Sync Information</CardTitle>
              <CardDescription>
                What data we collect from your Spotify account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Top tracks and artists</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Recently played music</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Saved/liked tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Public playlists</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}