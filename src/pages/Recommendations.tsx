import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Sparkles
} from "lucide-react";

const mockRecommendations = {
  music: [
    {
      id: 1,
      title: "Weightless",
      artist: "Marconi Union",
      type: "track",
      confidence: 0.94,
      reason: "Based on your love for ambient and scientifically-crafted soundscapes",
      spotifyUrl: "spotify:track:example",
      image: "/api/placeholder/300/300"
    },
    {
      id: 2,
      title: "In a Silent Way",
      artist: "Miles Davis",
      type: "album",
      confidence: 0.89,
      reason: "Perfect fusion of jazz and electronic elements you enjoy",
      spotifyUrl: "spotify:album:example",
      image: "/api/placeholder/300/300"
    }
  ],
  books: [
    {
      id: 3,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      confidence: 0.92,
      reason: "Combines philosophical depth with accessible storytelling",
      buyUrl: "https://bookshop.org/example",
      image: "/api/placeholder/200/300"
    },
    {
      id: 4,
      title: "The Ministry for the Future",
      author: "Kim Stanley Robinson",
      confidence: 0.87,
      reason: "Speculative fiction with environmental consciousness",
      buyUrl: "https://bookshop.org/example",
      image: "/api/placeholder/200/300"
    }
  ],
  movies: [
    {
      id: 5,
      title: "Decision to Leave",
      director: "Park Chan-wook",
      year: 2022,
      confidence: 0.91,
      reason: "Sophisticated thriller with artistic cinematography",
      trailerUrl: "https://youtube.com/watch?v=example",
      image: "/api/placeholder/300/450"
    },
    {
      id: 6,
      title: "The Favourite",
      director: "Yorgos Lanthimos",
      year: 2018,
      confidence: 0.88,
      reason: "Darkly comedic period piece with unconventional storytelling",
      trailerUrl: "https://youtube.com/watch?v=example",
      image: "/api/placeholder/300/450"
    }
  ],
  travel: [
    {
      id: 7,
      title: "Lisbon, Portugal",
      type: "city",
      confidence: 0.85,
      reason: "Rich cultural scene with excellent food and music venues",
      mapsUrl: "https://maps.google.com/example",
      image: "/api/placeholder/400/300"
    },
    {
      id: 8,
      title: "Seoul, South Korea",
      type: "city", 
      confidence: 0.93,
      reason: "Perfect blend of traditional culture and cutting-edge innovation",
      mapsUrl: "https://maps.google.com/example",
      image: "/api/placeholder/400/300"
    }
  ]
};

const categoryIcons = {
  music: Music,
  books: Book,
  movies: Film,
  travel: MapPin,
  fashion: Shirt
};

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState("music");
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [dismissedItems, setDismissedItems] = useState<number[]>([]);

  const handleLike = (id: number) => {
    setLikedItems(prev => [...prev, id]);
  };

  const handleDismiss = (id: number) => {
    setDismissedItems(prev => [...prev, id]);
  };

  const getFilteredRecommendations = (category: string) => {
    return mockRecommendations[category as keyof typeof mockRecommendations]?.filter(
      item => !dismissedItems.includes(item.id)
    ) || [];
  };

  const renderMusicCard = (item: any) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-square bg-primary/10 flex items-center justify-center">
        <Music className="w-12 h-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-muted-foreground mb-2">{item.artist}</p>
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

  const renderBookCard = (item: any) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-[2/3] bg-primary/10 flex items-center justify-center">
        <Book className="w-12 h-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-muted-foreground mb-2">by {item.author}</p>
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

  const renderMovieCard = (item: any) => (
    <Card key={item.id} className="glass hover-lift overflow-hidden">
      <div className="aspect-[2/3] bg-primary/10 flex items-center justify-center">
        <Film className="w-12 h-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
        <p className="text-muted-foreground mb-2">{item.director} • {item.year}</p>
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

  const renderTravelCard = (item: any) => (
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
          <Button className="glass-button">
            <RefreshCw className="w-4 h-4 mr-2" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredRecommendations("music").map(renderMusicCard)}
            </div>
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
                {Object.values(mockRecommendations).flat().length - dismissedItems.length}
              </div>
              <p className="text-muted-foreground">Active Recommendations</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">89%</div>
              <p className="text-muted-foreground">Average Match Score</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}