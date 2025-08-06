import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaSearch, MediaGrid, MediaEmbed } from "@/components/media/MediaEmbed";
import { MediaSearchService, MediaItem, SearchResult } from "@/lib/mediaEmbeds";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Music,
  Video,
  BookOpen,
  Grid,
  List,
  Filter,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MediaSearchPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'spotify' | 'youtube' | 'google-books'>('all');
  const [mediaService, setMediaService] = useState<MediaSearchService | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Initialize media service with API keys
    // In a real app, these would come from environment variables or user settings
    const service = new MediaSearchService(
      user?.spotify_access_token, // Spotify token from user profile
      process.env.REACT_APP_YOUTUBE_API_KEY, // YouTube API key
      process.env.REACT_APP_GOOGLE_BOOKS_API_KEY // Google Books API key
    );
    setMediaService(service);
  }, [user]);

  const handleSearch = async (query: string, type?: 'spotify' | 'youtube' | 'google-books') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('media-search', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: {
          query,
          type,
          limit: 20,
        },
      });

      if (error) throw error;

      setSearchResults(data);
      setActiveTab(type || 'all');
      
      toast({
        title: "Search Complete",
        description: `Found ${data.totalResults} results for "${query}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
  };

  const getFilteredResults = () => {
    if (!searchResults) return [];
    
    if (activeTab === 'all') {
      return searchResults.items;
    }
    
    return searchResults.items.filter(item => item.type === activeTab);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'spotify':
        return <Music className="w-4 h-4" />;
      case 'youtube':
        return <Video className="w-4 h-4" />;
      case 'google-books':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'spotify':
        return 'text-green-500';
      case 'youtube':
        return 'text-red-500';
      case 'google-books':
        return 'text-blue-500';
      default:
        return 'text-primary';
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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shimmer">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient bg-gradient-primary bg-clip-text text-transparent">
                Media Discovery
              </h1>
              <p className="text-muted-foreground">
                Search across Spotify, YouTube, and Google Books
              </p>
            </div>
          </div>

          {/* Search Interface */}
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <MediaSearch onSearch={handleSearch} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {searchResults && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {searchResults.totalResults} results for "{searchResults.query}"
                </h2>
                <Badge variant="secondary" className="glass-card">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="glass-card"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="glass-card"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="glass-card">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  {getTabIcon('all')}
                  All ({searchResults.totalResults})
                </TabsTrigger>
                <TabsTrigger value="spotify" className="flex items-center gap-2">
                  {getTabIcon('spotify')}
                  Spotify ({searchResults.items.filter(i => i.type === 'spotify').length})
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  {getTabIcon('youtube')}
                  YouTube ({searchResults.items.filter(i => i.type === 'youtube').length})
                </TabsTrigger>
                <TabsTrigger value="google-books" className="flex items-center gap-2">
                  {getTabIcon('google-books')}
                  Books ({searchResults.items.filter(i => i.type === 'google-books').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Searching...</p>
                    </div>
                  </div>
                ) : getFilteredResults().length === 0 ? (
                  <Card className="glass-card">
                    <CardContent className="p-8 text-center">
                      <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search terms or browse different categories.
                      </p>
                      <Button onClick={() => setSearchResults(null)} className="glass-button">
                        New Search
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeTab}-${viewMode}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {viewMode === 'grid' ? (
                        <MediaGrid 
                          items={getFilteredResults()} 
                          onItemClick={handleItemClick}
                        />
                      ) : (
                        <div className="space-y-4">
                          {getFilteredResults().map((item) => (
                            <MediaEmbed 
                              key={item.id} 
                              item={item} 
                              showEmbed={false}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Selected Item Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseItem}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <MediaEmbed 
                  item={selectedItem} 
                  onClose={handleCloseItem}
                  showEmbed={true}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
};

export default MediaSearchPage;