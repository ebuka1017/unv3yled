import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Bookmark, ExternalLink, Music, Film, Book, MapPin, Shirt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedRecommendation {
  id: string;
  category: string;
  user_prompt: string;
  qloo_response: any;
  gemini_insights: string;
  created_at: string;
  confidence_score: number;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'music': return Music;
    case 'movies': case 'tv': return Film;
    case 'books': return Book;
    case 'travel': return MapPin;
    case 'fashion': return Shirt;
    default: return Bookmark;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'music': return 'bg-green-100 text-green-800 border-green-200';
    case 'movies': case 'tv': return 'bg-red-100 text-red-800 border-red-200';
    case 'books': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'travel': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'fashion': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function Saved() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<SavedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchSavedRecommendations();
    }
  }, [user]);

  const fetchSavedRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('qloo_recommendations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching saved recommendations:', error);
      toast({
        title: "Failed to load saved items",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = new Set(recommendations.map(r => r.category));
    return Array.from(categories);
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Saved Recommendations</h1>
        <p className="text-muted-foreground">Your collection of personalized cultural discoveries</p>
      </div>

      {recommendations.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved recommendations yet</h3>
            <p className="text-muted-foreground text-center">
              Start exploring and save recommendations that interest you
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="pill-button"
              >
                All ({recommendations.length})
              </Button>
              {getCategories().map((category) => {
                const count = recommendations.filter(r => r.category === category).length;
                const Icon = getCategoryIcon(category);
                
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="pill-button"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid gap-6">
            {filteredRecommendations.map((recommendation) => {
              const Icon = getCategoryIcon(recommendation.category);
              const categoryColor = getCategoryColor(recommendation.category);
              const items = Array.isArray(recommendation.qloo_response?.results) 
                ? recommendation.qloo_response.results.slice(0, 3)
                : [];

              return (
                <Card key={recommendation.id} className="glass-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{recommendation.user_prompt}</CardTitle>
                          <CardDescription className="mt-1">
                            {new Date(recommendation.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className={categoryColor}>
                        {recommendation.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* AI Insights */}
                    {recommendation.gemini_insights && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">AI Insights</h4>
                        <p className="text-sm text-muted-foreground">
                          {recommendation.gemini_insights}
                        </p>
                      </div>
                    )}

                    {/* Recommendations */}
                    {items.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Recommendations</h4>
                        <div className="grid gap-3">
                          {items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                              <div>
                                <h5 className="font-medium">{item.name || item.title}</h5>
                                {item.artist && (
                                  <p className="text-sm text-muted-foreground">by {item.artist}</p>
                                )}
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              
                              {item.external_urls?.spotify && (
                                <Button size="sm" variant="outline" className="pill-button">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Confidence Score */}
                    {recommendation.confidence_score && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Confidence:</span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${recommendation.confidence_score * 100}%` }}
                          />
                        </div>
                        <span>{Math.round(recommendation.confidence_score * 100)}%</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}