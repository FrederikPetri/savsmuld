'use client'

import { useState, useEffect } from 'react'

interface ConfigData {
  isConfigured: boolean
  hasUrl: boolean
  hasKey: boolean
  urlContainsPlaceholder: boolean
  urlContainsSupabase: boolean
}

export default function DebugPage() {
  const [config, setConfig] = useState<ConfigData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching config:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Server-Side Configuration Check:</h2>
          <p><strong>isConfigured:</strong> {config?.isConfigured ? '✅ True' : '❌ False'}</p>
          <p><strong>hasUrl:</strong> {config?.hasUrl ? '✅ True' : '❌ False'}</p>
          <p><strong>hasKey:</strong> {config?.hasKey ? '✅ True' : '❌ False'}</p>
          <p><strong>urlContainsPlaceholder:</strong> {config?.urlContainsPlaceholder ? 'Yes' : 'No'}</p>
          <p><strong>urlContainsSupabase:</strong> {config?.urlContainsSupabase ? 'Yes' : 'No'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Client-Side Environment Variables:</h2>
          <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
          <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
        </div>
      </div>
    </div>
  )
} 