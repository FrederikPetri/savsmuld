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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<UiProject[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setProjects([])
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
        setProjects(mapped)
      } catch (err) {
        console.error('Failed to load projects:', err)
        setProjects([])
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
        <div className="mb-6 text-gray-600">Indlæser projekter...</div>
      )}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Byggeprojekter</h1>
        <p className="text-lg text-gray-600">
          Find detaljerede byggeplaner med 3D‑modeller, materialelister og trin‑for‑trin vejledninger.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Søg i projekter..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle sværhedsgrader</option>
            <option value="beginner">Begynder</option>
            <option value="intermediate">Øvet</option>
            <option value="advanced">Avanceret</option>
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle priser</option>
            <option value="low">Under 300 kr</option>
            <option value="medium">300–600 kr</option>
            <option value="high">Over 600 kr</option>
          </select>

          <div className="flex items-center justify-center text-gray-600">
            {filteredProjects.length} projekter fundet
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Wrench className="h-16 w-16 text-white" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty === 'beginner' ? 'Begynder' : project.difficulty === 'intermediate' ? 'Øvet' : 'Avanceret'}
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
                    {project.tools_required.length} værktøjer
                  </span>
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Se detaljer
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Ingen projekter matcher dine filtre, eller der er endnu ingen projekter.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setDifficultyFilter('all')
              setPriceRange('all')
            }}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Nulstil alle filtre
          </button>
        </div>
      )}
    </div>
  )
} 