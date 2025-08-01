export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          context_summary: string | null
          created_at: string
          id: string
          messages: Json | null
          recommendation_context: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_summary?: string | null
          created_at?: string
          id?: string
          messages?: Json | null
          recommendation_context?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_summary?: string | null
          created_at?: string
          id?: string
          messages?: Json | null
          recommendation_context?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      match_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          match_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          match_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          match_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          similarity_score: number
          status: string | null
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          similarity_score: number
          status?: string | null
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          similarity_score?: number
          status?: string | null
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user_a_fkey"
            columns: ["user_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "matches_user_b_fkey"
            columns: ["user_b"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          location: string | null
          onboarded_at: string | null
          preferences: Json | null
          spotify_access_token: string | null
          spotify_connected: boolean | null
          spotify_id: string | null
          spotify_refresh_token: string | null
          spotify_token_expires_at: string | null
          taste_profile: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          onboarded_at?: string | null
          preferences?: Json | null
          spotify_access_token?: string | null
          spotify_connected?: boolean | null
          spotify_id?: string | null
          spotify_refresh_token?: string | null
          spotify_token_expires_at?: string | null
          taste_profile?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          onboarded_at?: string | null
          preferences?: Json | null
          spotify_access_token?: string | null
          spotify_connected?: boolean | null
          spotify_id?: string | null
          spotify_refresh_token?: string | null
          spotify_token_expires_at?: string | null
          taste_profile?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qloo_recommendations: {
        Row: {
          category: string
          confidence_score: number | null
          conversation_id: string | null
          created_at: string
          gemini_insights: string | null
          id: string
          metadata: Json | null
          qloo_response: Json
          user_id: string
          user_prompt: string
        }
        Insert: {
          category: string
          confidence_score?: number | null
          conversation_id?: string | null
          created_at?: string
          gemini_insights?: string | null
          id?: string
          metadata?: Json | null
          qloo_response: Json
          user_id: string
          user_prompt: string
        }
        Update: {
          category?: string
          confidence_score?: number | null
          conversation_id?: string | null
          created_at?: string
          gemini_insights?: string | null
          id?: string
          metadata?: Json | null
          qloo_response?: Json
          user_id?: string
          user_prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "qloo_recommendations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qloo_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      recommendation_feedback: {
        Row: {
          created_at: string
          feedback_type: string
          feedback_value: number | null
          id: string
          notes: string | null
          recommendation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_type: string
          feedback_value?: number | null
          id?: string
          notes?: string | null
          recommendation_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_type?: string
          feedback_value?: number | null
          id?: string
          notes?: string | null
          recommendation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_feedback_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "qloo_recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendation_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      spotify_data: {
        Row: {
          created_at: string
          data_type: string
          external_urls: Json | null
          id: string
          images: Json | null
          last_synced: string
          metadata: Json | null
          name: string
          popularity: number | null
          spotify_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_type: string
          external_urls?: Json | null
          id?: string
          images?: Json | null
          last_synced?: string
          metadata?: Json | null
          name: string
          popularity?: number | null
          spotify_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_type?: string
          external_urls?: Json | null
          id?: string
          images?: Json | null
          last_synced?: string
          metadata?: Json | null
          name?: string
          popularity?: number | null
          spotify_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spotify_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      taste_match_profiles: {
        Row: {
          cultural_summary: string | null
          id: string
          last_updated: string
          qloo_vector: Json | null
          user_id: string
        }
        Insert: {
          cultural_summary?: string | null
          id?: string
          last_updated?: string
          qloo_vector?: Json | null
          user_id: string
        }
        Update: {
          cultural_summary?: string | null
          id?: string
          last_updated?: string
          qloo_vector?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "taste_match_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
