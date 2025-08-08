import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Client-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes)
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder_key' &&
         supabaseUrl.includes('supabase.co')
}

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          difficulty: string
          tools_required: string[]
          rating: number
          image_url: string
          pdf_url: string
          sketchup_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          difficulty: string
          tools_required: string[]
          rating: number
          image_url: string
          pdf_url: string
          sketchup_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          difficulty?: string
          tools_required?: string[]
          rating?: number
          image_url?: string
          pdf_url?: string
          sketchup_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          project_id: string
          purchased_at: string
          amount: number
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          purchased_at?: string
          amount: number
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          purchased_at?: string
          amount?: number
        }
      }
      stores: {
        Row: {
          id: string
          name: string
          location: string
          website: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          website: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          website?: string
        }
      }
    }
  }
} 