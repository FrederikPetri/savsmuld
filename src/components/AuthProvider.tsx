'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isConfigured: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check configuration from server
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.isConfigured)
        
        if (!data.isConfigured) {
          setLoading(false)
          return
        }

        // Get initial session
        const getInitialSession = async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
          } catch (error) {
            console.warn('Supabase not configured, using mock authentication')
          } finally {
            setLoading(false)
          }
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
          }
        )

        return () => subscription.unsubscribe()
      })
      .catch(err => {
        console.error('Error checking configuration:', err)
        setLoading(false)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isConfigured }}>
      {children}
    </AuthContext.Provider>
  )
} 