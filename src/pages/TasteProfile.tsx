import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Music, Book, Film, MapPin, Shirt, Star, Loader2 } from "lucide-react";

const mockTasteData = {
  music: {
    score: 92,
    genres: ["Indie Rock", "Electronic", "Jazz Fusion"],
    topArtists: ["Tame Impala", "Bonobo", "GoGo Penguin"]
  },
  books: {
    score: 87,
    genres: ["Sci-Fi", "Philosophy", "Historical Fiction"],
    favorites: ["Dune", "Sapiens", "The Seven Husbands of Evelyn Hugo"]
  },
  movies: {
    score: 85,
    genres: ["Art House", "Thriller", "Comedy-Drama"],
    favorites: ["Everything Everywhere All at Once", "Parasite", "The Grand Budapest Hotel"]
  },
  travel: {
    score: 90,
    preferences: ["Cultural Immersion", "Urban Exploration", "Food Tourism"],
    destinations: ["Tokyo", "Istanbul", "Barcelona"]
  },
  fashion: {
    score: 78,
    style: ["Minimalist", "Avant-garde", "Sustainable"],
    brands: ["COS", "Issey Miyake", "Patagonia"]
  }
};

const categoryIcons = {
  music: Music,
  books: Book,
  movies: Film,
  travel: MapPin,
  fashion: Shirt
};

export default function TasteProfile() {
  const { user } = useAuth();
  const [tasteData, setTasteData] = useState(mockTasteData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserTasteData = async () => {
      if (!user) return;
      
      try {
        // Fetch user's Spotify data and other preference data
        const { data: spotifyData } = await supabase
          .from('spotify_data')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: recommendations } = await supabase
          .from('qloo_recommendations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Process and analyze data to create dynamic taste profile
        if (spotifyData || recommendations) {
          // For now, keep mock data but add real data processing here
          setTasteData(mockTasteData);
        }
      } catch (error) {
        console.error('Error fetching taste data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTasteData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing your taste profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-bubblegum bg-gradient-bubblegum bg-clip-text text-transparent">
            Your Taste Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            A deep dive into your cultural preferences and aesthetic sensibilities
          </p>
        </div>

        {/* Overall Score */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-5xl p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/20 mb-6 shimmer">
            <span className="text-4xl font-bold text-primary">86</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Cultural Intelligence Score</h2>
          <p className="text-muted-foreground">
            Your taste spans multiple domains with sophisticated preferences
          </p>
        </motion.div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tasteData).map(([category, data], index) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Card className="glass hover-lift h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 capitalize text-lg">
                        <div className="w-8 h-8 rounded-2xl bg-primary/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        {category}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-bold text-primary">{data.score}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(data as any).genres && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                          {(data as any).genres.map((genre: string) => (
                            <Badge key={genre} variant="secondary" className="rounded-full">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(data as any).style && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Style</h4>
                        <div className="flex flex-wrap gap-2">
                          {(data as any).style.map((style: string) => (
                            <Badge key={style} variant="secondary" className="rounded-full">
                              {style}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(data as any).preferences && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Preferences</h4>
                        <div className="flex flex-wrap gap-2">
                          {(data as any).preferences.map((pref: string) => (
                            <Badge key={pref} variant="secondary" className="rounded-full">
                              {pref}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {((data as any).topArtists || (data as any).favorites || (data as any).destinations || (data as any).brands) && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                          {(data as any).topArtists ? "Top Artists" : 
                           (data as any).favorites ? "Favorites" : 
                           (data as any).destinations ? "Dream Destinations" : "Brands"}
                        </h4>
                        <div className="space-y-1">
                          {((data as any).topArtists || (data as any).favorites || (data as any).destinations || (data as any).brands)?.slice(0, 3).map((item: string) => (
                            <div key={item} className="text-sm p-2 glass rounded-2xl">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-strong">
            <CardHeader>
              <CardTitle className="text-xl">AI Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Your taste profile reveals a sophisticated appreciation for experimental and boundary-pushing content across all domains. 
                You gravitate towards works that challenge conventional norms while maintaining artistic integrity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                There's a clear preference for creators and experiences that blend cultural elements, suggesting an open-minded and 
                globally-aware aesthetic sensibility. Your choices indicate someone who values authenticity and innovation over 
                mainstream popularity.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}