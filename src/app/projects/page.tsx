'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Star, 
  Wrench
} from 'lucide-react'
import { fetchAllProjects } from '@/lib/projects'
import { isSupabaseConfigured } from '@/lib/supabase'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'

interface UiProject {
  id: string
  title: string
  description: string
  price: number
  difficulty: Difficulty
  tools_required: string[]
  rating: number
  image_url?: string
}

// Mock data used when Supabase is not configured
const mockProjects: UiProject[] = [
  {
    id: '1',
    title: 'Garden Shed',
    description: 'A beautiful 2x3m garden shed with detailed instructions and material list.',
    price: 299,
    difficulty: 'beginner',
    tools_required: ['Hammer', 'Saw', 'Drill'],
    rating: 4.8
  },
  {
    id: '2',
    title: 'Workbench',
    description: 'Professional workbench with storage and power tool integration.',
    price: 499,
    difficulty: 'intermediate',
    tools_required: ['Circular Saw', 'Drill', 'Clamps'],
    rating: 4.9
  },
  {
    id: '3',
    title: 'Treehouse',
    description: 'Complete treehouse with safety features and detailed engineering plans.',
    price: 799,
    difficulty: 'advanced',
    tools_required: ['Professional Tools', 'Safety Equipment'],
    rating: 5.0
  },
  {
    id: '4',
    title: 'Adirondack Chair',
    description: 'Classic outdoor chair perfect for your garden or patio.',
    price: 199,
    difficulty: 'beginner',
    tools_required: ['Jigsaw', 'Drill', 'Sander'],
    rating: 4.7
  },
  {
    id: '5',
    title: 'Kitchen Island',
    description: 'Custom kitchen island with storage and butcher block top.',
    price: 599,
    difficulty: 'intermediate',
    tools_required: ['Table Saw', 'Router', 'Clamps'],
    rating: 4.6
  },
  {
    id: '6',
    title: 'Deck',
    description: 'Complete deck construction with railing and stairs.',
    price: 899,
    difficulty: 'advanced',
    tools_required: ['Professional Tools', 'Level', 'Safety Equipment'],
    rating: 4.8
  }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<UiProject[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setProjects(mockProjects)
          return
        }

        const rows = await fetchAllProjects()
        const mapped: UiProject[] = rows.map(row => ({
          id: String(row.id),
          title: row.title,
          description: row.description,
          price: row.price,
          difficulty: (row.difficulty as Difficulty) ?? 'beginner',
          tools_required: Array.isArray(row.tools_required) ? row.tools_required : [],
          rating: row.rating ?? 0,
          image_url: row.image_url ?? undefined,
        }))
        setProjects(mapped.length ? mapped : mockProjects)
      } catch (err) {
        console.error('Failed to load projects:', err)
        setProjects(mockProjects)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === (difficultyFilter as Difficulty)
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && project.price <= 300) ||
                        (priceRange === 'medium' && project.price > 300 && project.price <= 600) ||
                        (priceRange === 'high' && project.price > 600)
    
    return matchesSearch && matchesDifficulty && matchesPrice
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {isLoading && (
        <div className="mb-6 text-gray-600">Loading projects...</div>
      )}
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Building Projects</h1>
        <p className="text-lg text-gray-600">
          Discover detailed building plans with 3D models, material lists, and step-by-step instructions.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Prices</option>
            <option value="low">Under 300 kr</option>
            <option value="medium">300-600 kr</option>
            <option value="high">Over 600 kr</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center text-gray-600">
            {filteredProjects.length} projects found
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Wrench className="h-16 w-16 text-white" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty.charAt(0).toUpperCase() + project.difficulty.slice(1)}
                </span>
                <span className="text-2xl font-bold text-gray-900">{project.price} kr</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4">{project.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(project.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{project.rating}/5</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="flex items-center">
                    <Wrench className="h-4 w-4 mr-1" />
                    {project.tools_required.length} tools
                  </span>
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setDifficultyFilter('all')
              setPriceRange('all')
            }}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
} 