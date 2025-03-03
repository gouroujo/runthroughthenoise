"use client"

import { useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import { motion } from "framer-motion"

export type Location = {
  title: string
  description: string
  latitude: string
  longitude: string
  publishedAt: string
}

// The WorldMap component now accepts locations as props
const WorldMap = ({ locations = [] }: { locations?: Location[] }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    // Import Leaflet dynamically to ensure it only runs on the client
    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import("leaflet")).default

        if (!mapRef.current) return

        // Initialize map only if it hasn't been initialized yet
        if (!leafletMap.current) {
          // Calculate the initial view based on available locations or default to world view
          const initialCoordinates =
            locations.length > 0
              ? [
                  parseFloat(locations[0].latitude),
                  parseFloat(locations[0].longitude),
                ]
              : [30, 15]

          leafletMap.current = L.map(mapRef.current).setView(
            initialCoordinates as [number, number],
            locations.length === 1 ? 10 : 3,
          )

          // Add base map tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(leafletMap.current)

          // Create a standard marker icon for all locations
          const createMarkerIcon = () =>
            L.divIcon({
              className:
                "rounded-full border-2 bg-emerald-500 border-emerald-700",
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })

          // Add markers for each location if there are any
          if (locations.length > 0) {
            locations.forEach((location) => {
              const coordinates: [number, number] = [
                parseFloat(location.latitude),
                parseFloat(location.longitude),
              ]

              // Skip invalid coordinates
              if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
                console.warn(`Invalid coordinates for ${location.title}`)
                return
              }

              const marker = L.marker(coordinates, {
                icon: createMarkerIcon(),
                title: location.title,
              }).addTo(leafletMap.current)

              // Format date from ISO to readable format
              const formattedDate = new Date(
                location.publishedAt,
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })

              const popupContent = `
                <div class="px-2 py-1">
                  <h3 class="font-bold text-primary">${location.title}</h3>
                  <p class="text-sm">${location.description || ""}</p>
                  <p class="text-xs text-gray-500 mt-1">${formattedDate}</p>
                </div>
              `

              marker.bindPopup(popupContent)
            })
          }

          // Force a map resize to ensure it renders correctly
          setTimeout(() => {
            if (leafletMap.current) {
              leafletMap.current.invalidateSize()
            }
          }, 100)
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError(
          error instanceof Error ? error.message : "Failed to initialize map",
        )
      }
    }

    initializeMap()

    // Cleanup on unmount
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove()
        leafletMap.current = null
      }
    }
  }, [locations])

  if (mapError) {
    return (
      <div className="h-[500px] w-full bg-red-50 rounded-lg flex items-center justify-center">
        <p className="text-red-500">Error loading map: {mapError}</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden relative z-10"
      >
        <div ref={mapRef} className="h-[500px] w-full" />
      </motion.div>
    </div>
  )
}

export default WorldMap
