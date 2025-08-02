import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Recommendation {
  id: string;
  category: 'music' | 'books' | 'movies' | 'travel';
  title: string;
  metadata: any;
  confidence: number;
  reason: string;
  image?: string;
  external_urls?: Record<string, string>;
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = useCallback(async (prompt: string, category?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('qloo-recommendations', {
        body: { prompt, context: category || 'general' }
      });

      if (error) throw error;

      if (data?.recommendations) {
        const enrichedRecommendations = await enrichWithMetadata(data.recommendations);
        setRecommendations(enrichedRecommendations);
      }

      return data;
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const enrichWithMetadata = async (rawRecommendations: any[]): Promise<Recommendation[]> => {
    const enriched = await Promise.all(
      rawRecommendations.map(async (rec) => {
        try {
          let metadata = rec.metadata || {};
          let image = rec.image;

          // Enrich based on category
          switch (rec.category) {
            case 'books':
              const bookData = await fetchBookMetadata(rec.title, rec.metadata?.author);
              metadata = { ...metadata, ...bookData.metadata };
              image = bookData.image || image;
              break;

            case 'movies':
              const movieData = await fetchMovieMetadata(rec.title);
              metadata = { ...metadata, ...movieData.metadata };
              image = movieData.image || image;
              break;

            case 'travel':
              const travelData = await fetchTravelImages(rec.title);
              image = travelData.image || image;
              break;

            default:
              break;
          }

          return {
            ...rec,
            metadata,
            image,
          };
        } catch (error) {
          console.warn(`Failed to enrich ${rec.category} recommendation:`, error);
          return rec;
        }
      })
    );

    return enriched;
  };

  const fetchBookMetadata = async (title: string, author?: string) => {
    try {
      const query = author ? `${title} ${author}` : title;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
      );
      const data = await response.json();

      if (data.items?.[0]) {
        const book = data.items[0].volumeInfo;
        return {
          metadata: {
            description: book.description,
            publishedDate: book.publishedDate,
            pageCount: book.pageCount,
            categories: book.categories,
            averageRating: book.averageRating,
            ratingsCount: book.ratingsCount,
            language: book.language,
            previewLink: book.previewLink,
            infoLink: book.infoLink,
          },
          image: book.imageLinks?.thumbnail?.replace('http:', 'https:') || undefined,
        };
      }
    } catch (error) {
      console.warn('Google Books API error:', error);
    }
    return { metadata: {}, image: undefined };
  };

  const fetchMovieMetadata = async (title: string) => {
    try {
      // Note: This would require TMDB API key
      // For now, return mock structure
      return {
        metadata: {
          overview: "Detailed movie description would come from TMDB API",
          release_date: "2023",
          vote_average: 8.5,
          runtime: 120,
          genres: ["Drama", "Thriller"],
        },
        image: "/api/placeholder/300/450",
      };
    } catch (error) {
      console.warn('TMDB API error:', error);
    }
    return { metadata: {}, image: undefined };
  };

  const fetchTravelImages = async (destination: string) => {
    try {
      // Note: This would require Getty Images API key
      // For now, return placeholder
      return {
        image: "/api/placeholder/400/300",
      };
    } catch (error) {
      console.warn('Getty Images API error:', error);
    }
    return { image: undefined };
  };

  return {
    recommendations,
    isLoading,
    generateRecommendations,
  };
}