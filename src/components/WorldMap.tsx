"use client"

import { useEffect, useRef, useState } from "react"
import Globe from "react-globe.gl"
import { motion } from "framer-motion"

export type Location = {
  title: string
  description: string
  latitude: string
  longitude: string
  publishedAt: string
}

const WorldMap = ({ locations = [] }: { locations?: Location[] }) => {
  const globeRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 800 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Update dimensions on container resize
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setDimensions({
          width,
          height: Math.max(800, width * 0.8),
        })
      }
    }

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)
    updateDimensions() // Initial measurement

    return () => observer.disconnect()
  }, [])

  // Handle auto-rotation
  useEffect(() => {
    if (!globeRef.current) return

    // Enable auto-rotation
    const controls = globeRef.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = false

    // Center the globe
    globeRef.current.camera().position.set(0, 0, 500)
    globeRef.current.camera().lookAt(0, 0, 0)

    return () => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false
      }
    }
  }, [])

  // Process locations data for the globe
  const pointsData = locations.map((loc) => ({
    lat: parseFloat(loc.latitude),
    lng: parseFloat(loc.longitude),
    size: 1.2,
    color: new Date(loc.publishedAt) > new Date() ? "#5A5A5A" : "#000000",
    title: loc.title,
    description: loc.description,
    date: new Date(loc.publishedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }),
  }))

  // Create arcs data for connecting points
  const arcsData = (() => {
    const sortedLocations = [...locations].sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    )

    return sortedLocations.slice(0, -1).map((loc, idx) => {
      const nextLoc = sortedLocations[idx + 1]
      const isFuture = new Date(loc.publishedAt) > new Date()
      return {
        startLat: parseFloat(loc.latitude),
        startLng: parseFloat(loc.longitude),
        endLat: parseFloat(nextLoc.latitude),
        endLng: parseFloat(nextLoc.longitude),
        color: isFuture ? "#5A5A5A" : "#000000",
      }
    })
  })()

  return (
    <div className="relative" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-hidden relative z-10"
      >
        <div
          className="flex items-center justify-center"
          style={{ height: dimensions.height }}
        >
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl="/images/earth.png"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(255,255,255,0)"
            pointsData={pointsData}
            pointAltitude={0.01}
            pointColor="color"
            pointLabel={(point: any) => `
              <div class="px-2 py-1">
                <h3 class="font-bold text-primary">${point.title}</h3>
                <p class="text-sm">${point.description || ""}</p>
                <p class="text-xs text-gray-500 mt-1">${point.date}</p>
              </div>
            `}
            arcsData={arcsData}
            arcColor="color"
            arcCurveResolution={64}
            arcDashLength="dashLength"
            arcDashGap="dashGap"
            arcDashInitialGap={0}
            arcDashAnimateTime={0}
            arcAltitude={0}
            arcStroke={0.75}
            atmosphereColor="#ffffff"
            atmosphereAltitude={0.15}
            onGlobeReady={() => {
              if (globeRef.current && locations.length > 0) {
                globeRef.current.pointOfView(
                  {
                    lat: 10,
                    lng: parseFloat(locations[0].longitude),
                    altitude: 2,
                  },
                  1000,
                )
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default WorldMap
