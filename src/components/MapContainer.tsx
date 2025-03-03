"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Location } from "./WorldMap"

// Dynamically import the WorldMap component with no SSR
const WorldMapNoSSR = dynamic(() => import("./WorldMap"), {
  ssr: false,
})

interface MapContainerProps {
  locations?: Location[]
}

const MapContainer = ({ locations = [] }: MapContainerProps) => (
  <div className="w-full">
    <Suspense fallback={<MapLoadingFallback />}>
      <div className="relative">
        <WorldMapNoSSR locations={locations} />
        {locations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-20 pointer-events-none">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <p className="text-gray-600">No locations found</p>
              <p className="text-sm text-gray-500 mt-1">Add locations</p>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  </div>
)

const MapLoadingFallback = () => (
  <div className="h-[500px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500">Loading interactive map...</p>
    </div>
  </div>
)

export default MapContainer
