import Link from 'next/link'
import { 
  Hammer, 
  FileText, 
  Box, 
  ShoppingCart, 
  Wrench, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your Dreams with
            <span className="text-blue-600"> Professional Plans</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get detailed building instructions, 3D models, and complete material lists 
            for Danish stores. Perfect for DIY enthusiasts and professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/projects"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Browse Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/about"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Build Successfully
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed PDF Instructions</h3>
              <p className="text-gray-600">
                Step-by-step instructions with photos, measurements, and tips for every project.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3D Models & SketchUp Files</h3>
              <p className="text-gray-600">
                Interactive 3D models and downloadable SketchUp files with all measurements.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Danish Store Material Lists</h3>
              <p className="text-gray-600">
                Complete shopping lists with prices from Danish hardware stores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <Hammer className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Beginner
                  </span>
                  <span className="text-2xl font-bold text-gray-900">299 kr</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Garden Shed</h3>
                <p className="text-gray-600 mb-4">
                  A beautiful 2x3m garden shed with detailed instructions and material list.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Wrench className="h-4 w-4 mr-1" />
                      Basic tools
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      4.8/5
                    </span>
                  </div>
                  <Link 
                    href="/projects/garden-shed"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Hammer className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                    Intermediate
                  </span>
                  <span className="text-2xl font-bold text-gray-900">499 kr</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Workbench</h3>
                <p className="text-gray-600 mb-4">
                  Professional workbench with storage and power tool integration.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Wrench className="h-4 w-4 mr-1" />
                      Power tools
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      4.9/5
                    </span>
                  </div>
                  <Link 
                    href="/projects/workbench"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Hammer className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    Advanced
                  </span>
                  <span className="text-2xl font-bold text-gray-900">799 kr</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Treehouse</h3>
                <p className="text-gray-600 mb-4">
                  Complete treehouse with safety features and detailed engineering plans.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Wrench className="h-4 w-4 mr-1" />
                      Professional
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      5.0/5
                    </span>
                  </div>
                  <Link 
                    href="/projects/treehouse"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 rounded-3xl">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied builders who have completed their projects with our detailed plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/projects"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse All Projects
            </Link>
            <Link 
              href="/auth"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
