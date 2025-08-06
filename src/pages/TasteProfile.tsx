import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Music,
  BookOpen,
  Film,
  MapPin,
  Heart,
  Sparkles,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TasteData {
  user_id: string;
  spotify_data: {
    top_tracks: any[];
    top_artists: any[];
    recently_played: any[];
    saved_tracks: any[];
    playlists: any[];
  };
  qloo_vector: Record<string, number>;
  cultural_summary: string;
  last_updated: string;
  profile_completeness: number;
}

const TasteProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasteData, setTasteData] = useState<TasteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTasteData();
    }
  }, [user]);

  const fetchTasteData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch user's taste profile data
      const { data: profile, error: profileError } = await supabase
        .from('taste_match_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch Spotify data
      const { data: spotifyData, error: spotifyError } = await supabase
        .from('spotify_data')
        .select('*')
        .eq('user_id', user.id);

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (spotifyError) {
        console.error('Spotify data error:', spotifyError);
      }

      // Transform Spotify data
      const spotifyDataMap = spotifyData?.reduce((acc, item) => {
        acc[item.data_type] = item.metadata;
        return acc;
      }, {} as any) || {
        top_tracks: [],
        top_artists: [],
        recently_played: [],
        saved_tracks: [],
        playlists: [],
      };

      // Calculate profile completeness
      const completeness = calculateProfileCompleteness(profile, spotifyDataMap);

      const tasteData: TasteData = {
        user_id: user.id,
        spotify_data: spotifyDataMap,
        qloo_vector: profile?.qloo_vector || {},
        cultural_summary: profile?.cultural_summary || 'No cultural summary available yet.',
        last_updated: profile?.last_updated || new Date().toISOString(),
        profile_completeness: completeness,
      };

      setTasteData(tasteData);
    } catch (error) {
      console.error('Error fetching taste data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch taste profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompleteness = (profile: any, spotifyData: any): number => {
    let score = 0;
    let total = 0;

    // Spotify data completeness
    if (spotifyData.top_tracks?.length > 0) score += 20;
    if (spotifyData.top_artists?.length > 0) score += 20;
    if (spotifyData.recently_played?.length > 0) score += 15;
    if (spotifyData.saved_tracks?.length > 0) score += 15;
    if (spotifyData.playlists?.length > 0) score += 10;
    total += 80;

    // Qloo vector completeness
    if (profile?.qloo_vector && Object.keys(profile.qloo_vector).length > 0) score += 20;
    total += 20;

    return Math.round((score / total) * 100);
  };

  const refreshTasteData = async () => {
    setIsRefreshing(true);
    try {
      // Trigger Spotify sync
      const { error } = await supabase.functions.invoke('spotify-sync', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Refresh taste data
      await fetchTasteData();

      toast({
        title: "Profile Updated",
        description: "Your taste profile has been refreshed with latest data.",
      });
    } catch (error) {
      console.error('Error refreshing taste data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh taste profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'books':
        return <BookOpen className="w-4 h-4" />;
      case 'movies':
        return <Film className="w-4 h-4" />;
      case 'travel':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'music':
        return 'bg-green-500';
      case 'books':
        return 'bg-blue-500';
      case 'movies':
        return 'bg-purple-500';
      case 'travel':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shimmer">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient bg-gradient-primary bg-clip-text text-transparent">
                  Taste Profile
                </h1>
                <p className="text-muted-foreground">
                  Your cultural fingerprint and preferences
                </p>
              </div>
            </div>
            <Button
              onClick={refreshTasteData}
              disabled={isRefreshing}
              className="glass-button"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh Profile
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your taste profile...</p>
            </div>
          </div>
        ) : tasteData ? (
          <div className="space-y-6">
            {/* Profile Completeness */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-bold text-primary">
                      {tasteData.profile_completeness}%
                    </span>
                  </div>
                  <Progress value={tasteData.profile_completeness} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {tasteData.profile_completeness < 50 
                      ? "Complete your profile to get better recommendations"
                      : tasteData.profile_completeness < 80
                      ? "Your profile is looking good! Keep adding more data"
                      : "Excellent! Your profile is comprehensive"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cultural Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Cultural Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {tasteData.cultural_summary}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {new Date(tasteData.last_updated).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            {/* Spotify Data Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Spotify Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {tasteData.spotify_data.top_tracks?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Top Tracks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {tasteData.spotify_data.top_artists?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Top Artists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {tasteData.spotify_data.recently_played?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Recently Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {tasteData.spotify_data.saved_tracks?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Saved Tracks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {tasteData.spotify_data.playlists?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Playlists</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Taste Vector */}
            {Object.keys(tasteData.qloo_vector).length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Taste Vector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(tasteData.qloo_vector)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 10)
                      .map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="text-sm font-medium capitalize">
                              {category.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={score * 100} className="w-20 h-2" />
                            <span className="text-xs text-muted-foreground w-8">
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Taste Profile Found</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Spotify account and start using the app to build your taste profile.
              </p>
              <Button onClick={() => navigate('/spotify')} className="glass-button">
                Connect Spotify
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
};

export default TasteProfile;