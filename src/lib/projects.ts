import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

export type ProjectRow = Database['public']['Tables']['projects']['Row']

export async function fetchAllProjects(): Promise<ProjectRow[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects from Supabase:', error.message)
    return []
  }

  return data ?? []
}

export async function fetchProjectById(id: string): Promise<ProjectRow | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching project from Supabase:', error.message)
    return null
  }

  return data
}


