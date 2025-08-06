import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Sparkles,
  MessageSquare,
  Heart,
  User,
  MapPin,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TasteTwin {
  user_id: string;
  similarity_score: number;
  cultural_summary: string;
  user_details: {
    email: string;
    age: number;
    location: string;
  } | null;
}

const TasteTwins = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasteTwins, setTasteTwins] = useState<TasteTwin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      findTasteTwins();
    }
  }, [user]);

  const findTasteTwins = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('taste-twin-matching', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setTasteTwins(data.matches || []);
    } catch (error) {
      console.error('Error finding taste twins:', error);
      toast({
        title: "Error",
        description: "Failed to find taste twins. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMatches = async () => {
    setIsRefreshing(true);
    await findTasteTwins();
    setIsRefreshing(false);
  };

  const connectWithTwin = async (twinId: string) => {
    try {
      // Update match status to accepted
      const { error } = await supabase
        .from('matches')
        .update({ status: 'accepted' })
        .eq('user_a', user?.id)
        .eq('user_b', twinId);

      if (error) throw error;

      toast({
        title: "Connection Sent",
        description: "You've successfully connected with your taste twin!",
      });
    } catch (error) {
      console.error('Error connecting with twin:', error);
      toast({
        title: "Error",
        description: "Failed to connect with taste twin. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.9) return "bg-green-500";
    if (score >= 0.8) return "bg-blue-500";
    if (score >= 0.7) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const getSimilarityText = (score: number) => {
    if (score >= 0.9) return "Exceptional Match";
    if (score >= 0.8) return "Great Match";
    if (score >= 0.7) return "Good Match";
    return "Fair Match";
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
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient bg-gradient-primary bg-clip-text text-transparent">
                  Taste Twins
                </h1>
                <p className="text-muted-foreground">
                  Discover people with similar cultural preferences
                </p>
              </div>
            </div>
            <Button
              onClick={refreshMatches}
              disabled={isRefreshing}
              variant="outline"
              className="glass-card"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh Matches
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Finding your taste twins...</p>
            </div>
          </div>
        ) : tasteTwins.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Taste Twins Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any users with similar taste profiles yet. 
                Try refreshing or check back later as more users join.
              </p>
              <Button onClick={refreshMatches} className="glass-button">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {tasteTwins.map((twin, index) => (
                <motion.div
                  key={twin.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card hover-lift">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              <User className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {twin.user_details?.email?.split('@')[0] || 'Anonymous'}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {twin.user_details?.location && (
                                <>
                                  <MapPin className="w-3 h-3" />
                                  <span>{twin.user_details.location}</span>
                                </>
                              )}
                              {twin.user_details?.age && (
                                <>
                                  <Calendar className="w-3 h-3" />
                                  <span>{twin.user_details.age} years</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={`${getSimilarityColor(twin.similarity_score)} text-white`}
                        >
                          {getSimilarityText(twin.similarity_score)}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Similarity Score</span>
                          <span className="text-sm font-bold text-primary">
                            {Math.round(twin.similarity_score * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getSimilarityColor(twin.similarity_score)}`}
                            style={{ width: `${twin.similarity_score * 100}%` }}
                          />
                        </div>
                      </div>

                      {twin.cultural_summary && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Cultural Profile
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {twin.cultural_summary}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => connectWithTwin(twin.user_id)}
                          className="flex-1 glass-button"
                          size="sm"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 glass-card"
                          size="sm"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default TasteTwins;