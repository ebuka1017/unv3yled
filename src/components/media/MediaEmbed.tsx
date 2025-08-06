import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  Music, 
  Video, 
  BookOpen,
  Star,
  Clock,
  User,
  Calendar,
  MapPin,
  Loader2
} from 'lucide-react';
import { MediaItem } from '@/lib/mediaEmbeds';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaEmbedProps {
  item: MediaItem;
  onClose?: () => void;
  showEmbed?: boolean;
}

export function MediaEmbed({ item, onClose, showEmbed = true }: MediaEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullEmbed, setShowFullEmbed] = useState(showEmbed);

  const getTypeIcon = () => {
    switch (item.type) {
      case 'spotify':
        return <Music className="w-4 h-4" />;
      case 'youtube':
        return <Video className="w-4 h-4" />;
      case 'google-books':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'spotify':
        return 'bg-green-500';
      case 'youtube':
        return 'bg-red-500';
      case 'google-books':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'spotify':
        return 'Spotify';
      case 'youtube':
        return 'YouTube';
      case 'google-books':
        return 'Google Books';
      default:
        return 'Media';
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleExternalLink = () => {
    window.open(item.url, '_blank');
  };

  const handleToggleEmbed = () => {
    setShowFullEmbed(!showFullEmbed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="glass-card hover-lift">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={item.thumbnail} />
                <AvatarFallback className={`${getTypeColor()} text-white`}>
                  {getTypeIcon()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className={getTypeColor()}>
                    {getTypeLabel()}
                  </Badge>
                  {item.metadata.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-muted-foreground">
                        {item.metadata.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {item.title}
                </CardTitle>
                {item.metadata.artist && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.metadata.artist}
                  </p>
                )}
                {item.metadata.year && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.metadata.year}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.metadata.duration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {item.metadata.duration}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExternalLink}
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.description}
            </p>
          )}

          {/* Additional Metadata */}
          <div className="flex flex-wrap gap-2">
            {item.metadata.genre && (
              <Badge variant="outline" className="text-xs">
                {item.metadata.genre}
              </Badge>
            )}
            {item.metadata.publisher && (
              <Badge variant="outline" className="text-xs">
                {item.metadata.publisher}
              </Badge>
            )}
            {item.metadata.pageCount && (
              <Badge variant="outline" className="text-xs">
                {item.metadata.pageCount} pages
              </Badge>
            )}
            {item.metadata.language && (
              <Badge variant="outline" className="text-xs">
                {item.metadata.language}
              </Badge>
            )}
            {item.metadata.isbn && (
              <Badge variant="outline" className="text-xs">
                ISBN: {item.metadata.isbn}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePlayPause}
              size="sm"
              className="flex-1 glass-button"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={handleToggleEmbed}
              variant="outline"
              size="sm"
              className="glass-card"
            >
              {showFullEmbed ? 'Hide' : 'Show'} Embed
            </Button>
          </div>

          {/* Embedded Content */}
          <AnimatePresence>
            {showFullEmbed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative w-full rounded-lg overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                  <iframe
                    src={item.embedUrl}
                    className="w-full h-80 border-0 rounded-lg"
                    allow="encrypted-media"
                    loading="lazy"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Media Grid Component for displaying multiple items
interface MediaGridProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem) => void;
}

export function MediaGrid({ items, onItemClick }: MediaGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onItemClick?.(item)}
            className="cursor-pointer"
          >
            <MediaEmbed item={item} showEmbed={false} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Media Search Component
interface MediaSearchProps {
  onSearch: (query: string, type?: 'spotify' | 'youtube' | 'google-books') => Promise<void>;
  isLoading?: boolean;
}

export function MediaSearch({ onSearch, isLoading }: MediaSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'spotify' | 'youtube' | 'google-books'>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const type = selectedType === 'all' ? undefined : selectedType;
    await onSearch(query, type);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music, videos, or books..."
          className="flex-1 glass-input px-4 py-2 rounded-lg"
          disabled={isLoading}
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="glass-input px-4 py-2 rounded-lg"
          disabled={isLoading}
        >
          <option value="all">All</option>
          <option value="spotify">Spotify</option>
          <option value="youtube">YouTube</option>
          <option value="google-books">Google Books</option>
        </select>
        <Button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="glass-button"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Search
        </Button>
      </form>
    </div>
  );
}