import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for better TypeScript support
export interface User {
  id: string
  email?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  username?: string
  full_name?: string
  avatar_url?: string
  bio?: string
  spotify_access_token?: string
  spotify_refresh_token?: string
  created_at: string
  updated_at: string
}

export interface SpotifyData {
  id: string
  user_id: string
  data_type: 'top_tracks' | 'top_artists' | 'recently_played' | 'saved_tracks' | 'playlists'
  metadata: any
  created_at: string
}

export interface QlooRecommendation {
  id: string
  user_id: string
  category: 'music' | 'books' | 'movies' | 'travel' | 'fashion'
  qloo_response: {
    title: string
    description: string
    reason: string
    external_urls: Record<string, string>
    metadata: Record<string, any>
  }
  confidence_score: number
  gemini_insights?: string
  created_at: string
}

export interface TasteMatchProfile {
  id: string
  user_id: string
  qloo_vector: Record<string, number>
  cultural_summary: string
  last_updated: string
  created_at: string
}