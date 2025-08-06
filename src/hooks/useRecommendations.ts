import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'music' | 'books' | 'movies' | 'travel' | 'fashion';
  confidence: number;
  reason: string;
  external_urls: {
    spotify?: string;
    youtube?: string;
    google_books?: string;
    imdb?: string;
    goodreads?: string;
  };
  metadata: {
    artist?: string;
    author?: string;
    director?: string;
    year?: number;
    genre?: string;
    rating?: number;
    duration?: string;
    location?: string;
    price_range?: string;
  };
  gemini_insights?: string;
  created_at: string;
}

export interface RecommendationsState {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useRecommendations() {
  const { user } = useAuth();
  const [state, setState] = useState<RecommendationsState>({
    recommendations: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchRecommendations = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch recommendations from the database
      const { data, error } = await supabase
        .from('qloo_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform the data to match our interface
      const recommendations: Recommendation[] = data.map(item => ({
        id: item.id,
        title: item.qloo_response.title || 'Unknown',
        description: item.qloo_response.description || '',
        category: item.category as any,
        confidence: item.confidence_score || 0.8,
        reason: item.qloo_response.reason || 'Recommended based on your preferences',
        external_urls: item.qloo_response.external_urls || {},
        metadata: item.qloo_response.metadata || {},
        gemini_insights: item.gemini_insights,
        created_at: item.created_at,
      }));

      setState({
        recommendations,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch recommendations',
      }));
    }
  };

  const generateRecommendations = async (prompt: string) => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call the Qloo recommendations edge function
      const { data, error } = await supabase.functions.invoke('qloo-recommendations', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: {
          prompt,
          context: 'user_request',
        },
      });

      if (error) throw error;

      // Refresh recommendations after generation
      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to generate recommendations',
      }));
    }
  };

  const saveRecommendation = async (recommendation: Recommendation) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_recommendations')
        .insert({
          user_id: user.id,
          recommendation_id: recommendation.id,
          saved_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving recommendation:', error);
      throw error;
    }
  };

  const unsaveRecommendation = async (recommendationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_recommendations')
        .delete()
        .eq('user_id', user.id)
        .eq('recommendation_id', recommendationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error unsaving recommendation:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  return {
    ...state,
    fetchRecommendations,
    generateRecommendations,
    saveRecommendation,
    unsaveRecommendation,
  };
}