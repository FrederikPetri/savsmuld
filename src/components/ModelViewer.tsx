'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Box, Sphere } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { Loader } from 'lucide-react'

interface ModelViewerProps {
  modelUrl?: string
  fallback?: boolean
}

export function ModelViewer({ modelUrl, fallback = true }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Simple fallback geometry when no model is provided
  const FallbackModel = () => (
    <group>
      {/* Base */}
      <Box args={[4, 0.2, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Walls */}
      <Box args={[4, 2, 0.1]} position={[0, 1, -1.5]}>
        <meshStandardMaterial color="#DEB887" />
      </Box>
      <Box args={[4, 2, 0.1]} position={[0, 1, 1.5]}>
        <meshStandardMaterial color="#DEB887" />
      </Box>
      <Box args={[0.1, 2, 3]} position={[-2, 1, 0]}>
        <meshStandardMaterial color="#DEB887" />
      </Box>
      <Box args={[0.1, 2, 3]} position={[2, 1, 0]}>
        <meshStandardMaterial color="#DEB887" />
      </Box>
      
      {/* Roof */}
      <Box args={[4.2, 0.1, 3.2]} position={[0, 2.1, 0]} rotation={[0, 0, 0.1]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Door */}
      <Box args={[0.8, 1.5, 0.05]} position={[0, 0.75, -1.45]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Windows */}
      <Box args={[0.6, 0.6, 0.05]} position={[-1, 1, -1.45]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box args={[0.6, 0.6, 0.05]} position={[1, 1, -1.45]}>
        <meshStandardMaterial color="#87CEEB" />
      </Box>
    </group>
  )

  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading 3D model...</span>
          </div>
        </div>
      )}
      
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {fallback ? <FallbackModel /> : null}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
} 