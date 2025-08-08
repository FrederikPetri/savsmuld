import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const isConfigured = supabaseUrl && 
                      supabaseAnonKey && 
                      !supabaseUrl.includes('placeholder') &&
                      supabaseUrl.includes('supabase.co')

  return NextResponse.json({
    isConfigured,
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlContainsPlaceholder: supabaseUrl?.includes('placeholder') || false,
    urlContainsSupabase: supabaseUrl?.includes('supabase.co') || false
  })
} 