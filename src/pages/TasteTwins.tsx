import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Heart, MessageCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TasteMatch {
  id: string;
  user_a: string;
  user_b: string;
  similarity_score: number;
  status: string;
  created_at: string;
  profile?: {
    display_name: string;
    avatar_url: string;
    email: string;
  };
}

export default function TasteTwins() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<TasteMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [discovering, setDiscovering] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          profiles!matches_user_b_fkey(display_name, avatar_url, email)
        `)
        .or(`user_a.eq.${user?.id},user_b.eq.${user?.id}`)
        .order('similarity_score', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const discoverMatches = async () => {
    setDiscovering(true);
    try {
      // This would typically call an edge function that:
      // 1. Gets user's taste profile
      // 2. Compares with other users' profiles
      // 3. Creates matches based on similarity
      
      toast({
        title: "Discovery started",
        description: "We're finding your taste twins...",
      });

      // Simulate discovery process
      setTimeout(() => {
        toast({
          title: "Discovery complete",
          description: "Check back soon for new matches!",
        });
        setDiscovering(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Discovery failed",
        description: "Failed to discover new matches. Please try again.",
        variant: "destructive",
      });
      setDiscovering(false);
    }
  };

  const acceptMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'accepted' })
        .eq('id', matchId);

      if (error) throw error;
      
      toast({
        title: "Match accepted",
        description: "You can now start chatting with your taste twin!",
      });
      
      await fetchMatches();
    } catch (error) {
      toast({
        title: "Failed to accept match",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSimilarityLevel = (score: number) => {
    if (score >= 0.8) return { label: "Exceptional", color: "bg-pink-100 text-pink-800 border-pink-200" };
    if (score >= 0.6) return { label: "High", color: "bg-purple-100 text-purple-800 border-purple-200" };
    if (score >= 0.4) return { label: "Moderate", color: "bg-blue-100 text-blue-800 border-blue-200" };
    return { label: "Emerging", color: "bg-gray-100 text-gray-800 border-gray-200" };
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Taste Twins</h1>
        <p className="text-muted-foreground">Discover people who share your cultural tastes and interests</p>
      </div>

      <div className="mb-6">
        <Button 
          onClick={discoverMatches} 
          disabled={discovering}
          className="pill-button"
        >
          {discovering ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Discovering...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Discover New Twins
            </>
          )}
        </Button>
      </div>

      {matches.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No taste twins yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Complete your taste profile and discover people with similar cultural preferences
            </p>
            <Button onClick={discoverMatches} className="pill-button">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Discovering
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => {
            const similarity = getSimilarityLevel(match.similarity_score);
            const otherUserId = match.user_a === user?.id ? match.user_b : match.user_a;
            
            return (
              <Card key={match.id} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={match.profile?.avatar_url} />
                        <AvatarFallback>
                          {match.profile?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-semibold">
                          {match.profile?.display_name || 'Anonymous User'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className={similarity.color}>
                            {similarity.label} Match
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(match.similarity_score * 100)}% similar
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {match.status === 'pending' && match.user_b === user?.id && (
                        <Button 
                          onClick={() => acceptMatch(match.id)}
                          className="pill-button"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                      )}
                      
                      {match.status === 'accepted' && (
                        <Button variant="outline" className="pill-button">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      Matched on {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}