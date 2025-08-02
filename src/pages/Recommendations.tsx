import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecommendations, Recommendation } from "@/hooks/useRecommendations";
import { 
  Music, 
  Book, 
  Film, 
  MapPin, 
  Shirt, 
  Heart, 
  X, 
  ExternalLink,
  RefreshCw,
  Sparkles,
  Loader2
} from "lucide-react";


const categoryIcons = {
  music: Music,
  books: Book,
  movies: Film,
  travel: MapPin,
  fashion: Shirt
};

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState("music");
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [dismissedItems, setDismissedItems] = useState<string[]>([]);
  const { recommendations, isLoading, generateRecommendations } = useRecommendations();

  useEffect(() => {
    // Generate initial recommendations
    generateRecommendations("I'd like some personalized recommendations based on my taste profile");
  }, [generateRecommendations]);

  const handleLike = (id: string) => {
    setLikedItems(prev => [...prev, id]);
  };

  const handleDismiss = (id: string) => {
    setDismissedItems(prev => [...prev, id]);
  };

  const getFilteredRecommendations = (category: string) => {
    return recommendations.filter(
      item => item.category === category && !dismissedItems.includes(item.id)
    );
  };

  const refreshRecommendations = async () => {
    await generateRecommendations(`Generate fresh ${activeTab} recommendations based on my taste profile`);
  };

  const renderMusicCard = (item: Recommendation) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-square bg-primary/10 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <Music className="w-12 h-12 text-primary/50" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-muted-foreground mb-2">{item.metadata?.artist || 'Unknown Artist'}</p>
        <Badge variant="secondary" className="rounded-full mb-3">
          {(item.confidence * 100).toFixed(0)}% match
        </Badge>
        <p className="text-sm text-muted-foreground mb-4">{item.reason}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleLike(item.id)}
            className="rounded-full flex-1"
            disabled={likedItems.includes(item.id)}
          >
            <Heart className={`w-4 h-4 mr-2 ${likedItems.includes(item.id) ? 'fill-current text-red-500' : ''}`} />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDismiss(item.id)}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
          {item.external_urls?.spotify && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-full"
              onClick={() => window.open(item.external_urls.spotify, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderBookCard = (item: Recommendation) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-[2/3] bg-primary/10 flex items-center justify-center">
        <Book className="w-12 h-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-muted-foreground mb-2">by {item.metadata?.author || 'Unknown Author'}</p>
        <Badge variant="secondary" className="rounded-full mb-3">
          {(item.confidence * 100).toFixed(0)}% match
        </Badge>
        <p className="text-sm text-muted-foreground mb-4">{item.reason}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleLike(item.id)}
            className="rounded-full flex-1"
            disabled={likedItems.includes(item.id)}
          >
            <Heart className={`w-4 h-4 mr-2 ${likedItems.includes(item.id) ? 'fill-current text-red-500' : ''}`} />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDismiss(item.id)}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMovieCard = (item: Recommendation) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-[2/3] bg-primary/10 flex items-center justify-center">
        <Film className="w-12 h-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-muted-foreground mb-2">{item.metadata?.director || 'Unknown Director'} • {item.metadata?.year || 'Unknown Year'}</p>
        <Badge variant="secondary" className="rounded-full mb-3">
          {(item.confidence * 100).toFixed(0)}% match
        </Badge>
        <p className="text-sm text-muted-foreground mb-4">{item.reason}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleLike(item.id)}
            className="rounded-full flex-1"
            disabled={likedItems.includes(item.id)}
          >
            <Heart className={`w-4 h-4 mr-2 ${likedItems.includes(item.id) ? 'fill-current text-red-500' : ''}`} />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDismiss(item.id)}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTravelCard = (item: Recommendation) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-video bg-primary/10 flex items-center justify-center">
        <MapPin className="w-12 h-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <Badge variant="secondary" className="rounded-full mb-3">
          {(item.confidence * 100).toFixed(0)}% match
        </Badge>
        <p className="text-sm text-muted-foreground mb-4">{item.reason}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleLike(item.id)}
            className="rounded-full flex-1"
            disabled={likedItems.includes(item.id)}
          >
            <Heart className={`w-4 h-4 mr-2 ${likedItems.includes(item.id) ? 'fill-current text-red-500' : ''}`} />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => handleDismiss(item.id)}
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="rounded-full">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-bubblegum bg-gradient-bubblegum bg-clip-text text-transparent mb-2">
              Serendipity
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover your next cultural obsession with AI-powered recommendations
            </p>
          </div>
          <Button 
            className="glass-button" 
            onClick={refreshRecommendations}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>

        {/* Recommendations Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass rounded-3xl p-1">
            <TabsTrigger value="music" className="rounded-3xl">
              <Music className="w-4 h-4 mr-2" />
              Music
            </TabsTrigger>
            <TabsTrigger value="books" className="rounded-3xl">
              <Book className="w-4 h-4 mr-2" />
              Books
            </TabsTrigger>
            <TabsTrigger value="movies" className="rounded-3xl">
              <Film className="w-4 h-4 mr-2" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="travel" className="rounded-3xl">
              <MapPin className="w-4 h-4 mr-2" />
              Travel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredRecommendations("music").map(renderMusicCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="books" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFilteredRecommendations("books").map(renderBookCard)}
            </div>
          </TabsContent>

          <TabsContent value="movies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFilteredRecommendations("movies").map(renderMovieCard)}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredRecommendations("travel").map(renderTravelCard)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-3xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {likedItems.length}
              </div>
              <p className="text-muted-foreground">Items Saved</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {recommendations.length - dismissedItems.length}
              </div>
              <p className="text-muted-foreground">Active Recommendations</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {recommendations.length > 0 
                  ? Math.round(recommendations.reduce((acc, rec) => acc + rec.confidence, 0) / recommendations.length * 100) + '%'
                  : '0%'
                }
              </div>
              <p className="text-muted-foreground">Average Match Score</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}