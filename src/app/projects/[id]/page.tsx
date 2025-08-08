'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ModelViewer } from '@/components/ModelViewer'
import { fetchProjectById } from '@/lib/projects'
import { isSupabaseConfigured } from '@/lib/supabase'
import { 
  Star, 
  Wrench, 
  Download, 
  FileText, 
  ShoppingCart,
  Clock,
  Users,
  CheckCircle,
  ExternalLink,
  CreditCard
} from 'lucide-react'

interface Material {
  name: string
  quantity: string
  price: number
  store: string
  store_url: string
}

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface UiProject {
  id: string
  title: string
  description: string
  price: number
  difficulty: Difficulty
  tools_required: string[]
  materials_list: Material[]
  estimated_time: string
  rating: number
  reviews_count: number
  pdf_url: string
  sketchup_url: string
}

// No mock fallback: if Supabase is not configured or project is missing, we'll show a minimal state

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<UiProject | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'tools' | 'reviews'>('overview')
  const [isPurchased, setIsPurchased] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setProject(null)
          return
        }
        const id = Array.isArray(params.id) ? params.id[0] : (params as any).id
        if (!id) {
          setProject(null)
          return
        }
        const row = await fetchProjectById(String(id))
        if (!row) {
          setProject(null)
          return
        }
        const mapped: UiProject = {
          id: String(row.id),
          title: row.title,
          description: row.description,
          price: row.price,
          difficulty: (row.difficulty as Difficulty) ?? 'beginner',
          tools_required: Array.isArray(row.tools_required) ? row.tools_required : [],
          materials_list: Array.isArray((row as any).materials_list) ? (row as any).materials_list : [],
          estimated_time: (row as any).estimated_time ?? 'N/A',
          rating: row.rating ?? 0,
          reviews_count: 0,
          pdf_url: row.pdf_url ?? '#',
          sketchup_url: row.sketchup_url ?? '#',
        }
        setProject(mapped)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load project'
        console.error('Error loading project:', errorMessage)
        setProject(null)
      }
    }
    load()
  }, [params.id])

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Indlæser projekt eller intet projekt fundet...</p>
        </div>
      </div>
    )
  }

  const totalMaterialsCost = project.materials_list.reduce((sum, material) => sum + material.price, 0)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePurchase = async () => {
    setIsProcessingPayment(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsPurchased(true)
      setIsProcessingPayment(false)
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-xl text-gray-600 mt-2">{project.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{project.price} kr</div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
              {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
            </span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-lg font-semibold">{project.rating}</span>
          </div>
          <span className="text-gray-600">({project.reviews_count} reviews)</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - 3D Model and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3D Model Viewer */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">3D‑model forhåndsvisning</h2>
            <ModelViewer />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overblik', icon: FileText },
                  { id: 'materials', label: 'Materialer', icon: ShoppingCart },
                  { id: 'tools', label: 'Værktøj', icon: Wrench },
                  { id: 'reviews', label: 'Anmeldelser', icon: Star }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'materials' | 'tools' | 'reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Projekt detaljer</h3>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Anslået tid</div>
                        <div className="text-sm text-gray-600">{project.estimated_time}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Wrench className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Sværhedsgrad</div>
                        <div className="text-sm text-gray-600 capitalize">{project.difficulty === 'beginner' ? 'begynder' : project.difficulty === 'intermediate' ? 'øvet' : 'avanceret'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium">Anmeldelser</div>
                        <div className="text-sm text-gray-600">{project.reviews_count} personer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Materialeliste</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{totalMaterialsCost} kr</div>
                      <div className="text-sm text-gray-600">Samlet anslået pris</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {project.materials_list.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-gray-600">{material.quantity}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">{material.price} kr</div>
                            <div className="text-sm text-gray-600">{material.store}</div>
                          </div>
                          <a
                            href={material.store_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tools' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Påkrævet værktøj</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.tools_required.map((tool, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Kundeanmeldelser</h3>
                  <p className="text-gray-600">Anmeldelser vises her.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Purchase and Downloads */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Køb dette projekt</h3>
            
            {isPurchased ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Projekt købt!</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a
                    href={project.pdf_url}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download PDF‑vejledning</span>
                  </a>
                  
                  <a
                    href={project.sketchup_url}
                    className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download SketchUp‑fil</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{project.price} kr</div>
                  <p className="text-gray-600">Engangskøb</p>
                </div>
                
                <button 
                  onClick={handlePurchase}
                  disabled={isProcessingPayment}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Behandler betaling...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Køb projekt</span>
                    </>
                  )}
                </button>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Detaljeret PDF‑vejledning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>3D‑modelviser</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SketchUp‑fil download</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Materialeliste fra danske butikker</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-700 text-xs">
                    💳 <strong>Demo‑tilstand:</strong> Dette er en simuleret betaling. Ingen rigtige køb foretages.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Project Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Projektstatistik</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sværhedsgrad</span>
                <span className="font-medium capitalize">{project.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Anslået tid</span>
                <span className="font-medium">{project.estimated_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Materialepris (anslået)</span>
                <span className="font-medium">{totalMaterialsCost} kr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Antal værktøjer</span>
                <span className="font-medium">{project.tools_required.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 