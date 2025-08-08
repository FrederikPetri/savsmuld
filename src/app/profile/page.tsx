'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Calendar, 
  Download, 
  FileText, 
  Box,
  Settings,
  LogOut
} from 'lucide-react'

interface PurchasedProject {
  id: string
  title: string
  purchased_at: string
  price: number
  pdf_url: string
  sketchup_url: string
  model_url: string
}

// Mock data - replace with actual Supabase query
const mockPurchasedProjects: PurchasedProject[] = [
  {
    id: '1',
    title: 'Garden Shed',
    purchased_at: '2024-01-15',
    price: 299,
    pdf_url: '/projects/garden-shed-instructions.pdf',
    sketchup_url: '/sketchup/garden-shed.skp',
    model_url: '/models/garden-shed.glb'
  },
  {
    id: '2',
    title: 'Adirondack Chair',
    purchased_at: '2024-01-10',
    price: 199,
    pdf_url: '/projects/adirondack-chair-instructions.pdf',
    sketchup_url: '/sketchup/adirondack-chair.skp',
    model_url: '/models/adirondack-chair.glb'
  }
]

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [purchasedProjects, setPurchasedProjects] = useState<PurchasedProject[]>([])
  const [activeTab, setActiveTab] = useState<'projects' | 'account'>('projects')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    // In a real app, fetch purchased projects from Supabase
    setPurchasedProjects(mockPurchasedProjects)
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-lg text-gray-600">
          Manage your account and access your purchased projects.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {user.user_metadata?.name || user.email}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Member since {formatDate(user.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>My Projects ({purchasedProjects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'projects' && (
            <div>
              {purchasedProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects purchased yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building by purchasing your first project.
                  </p>
                  <Link 
                    href="/projects/" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Projects
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Purchased Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {purchasedProjects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {project.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(project.purchased_at)}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <a
                            href={project.pdf_url}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            <span>Download PDF Instructions</span>
                          </a>
                          
                          <a
                            href={project.sketchup_url}
                            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download SketchUp File</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Member Since</div>
                    <div className="text-sm text-gray-600">{formatDate(user.created_at)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Name</div>
                    <div className="text-sm text-gray-600">
                      {user.user_metadata?.name || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 