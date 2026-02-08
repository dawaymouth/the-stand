export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          favorite_club: string
          favorite_players: string[]
          role: string
          notification_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          favorite_club?: string
          favorite_players?: string[]
          role?: string
          notification_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          favorite_club?: string
          favorite_players?: string[]
          role?: string
          notification_preferences?: Json
          updated_at?: string
        }
      }
      content_items: {
        Row: {
          id: string
          external_id: string
          source_name: string
          title: string
          url: string
          summary: string | null
          content: string | null
          author: string | null
          published_at: string
          fetched_at: string
          category: string | null
          tags: string[] | null
          is_featured: boolean
          curator_note: string | null
          quality_score: number
          thumbnail_url: string | null
          media_type: string | null
          view_count: number
          save_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          external_id: string
          source_name: string
          title: string
          url: string
          summary?: string | null
          content?: string | null
          author?: string | null
          published_at: string
          fetched_at?: string
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          curator_note?: string | null
          quality_score?: number
          thumbnail_url?: string | null
          media_type?: string | null
          view_count?: number
          save_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          external_id?: string
          source_name?: string
          title?: string
          url?: string
          summary?: string | null
          content?: string | null
          author?: string | null
          published_at?: string
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean
          curator_note?: string | null
          quality_score?: number
          thumbnail_url?: string | null
          media_type?: string | null
          updated_at?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          content_id: string
          saved_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          saved_at?: string
          notes?: string | null
        }
        Update: {
          notes?: string | null
        }
      }
      user_content_preferences: {
        Row: {
          user_id: string
          preferred_categories: string[]
          preferred_sources: string[]
          hidden_sources: string[]
          updated_at: string
        }
        Insert: {
          user_id: string
          preferred_categories?: string[]
          preferred_sources?: string[]
          hidden_sources?: string[]
          updated_at?: string
        }
        Update: {
          preferred_categories?: string[]
          preferred_sources?: string[]
          hidden_sources?: string[]
          updated_at?: string
        }
      }
    }
  }
}
