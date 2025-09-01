"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { S3Image } from "@/lib/s3"

type Props = {
  images: S3Image[]
  currentIndex: number
  onClose: () => void
  onNavigate: (direction: "prev" | "next") => void
  albumTitle: string
}

const ImageViewer = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
  albumTitle,
}: Props) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const currentImage = images[currentIndex]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onNavigate("prev")
      if (e.key === "ArrowRight") onNavigate("next")
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [onClose, onNavigate])

  const copyImageUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentImage.url)
      setShowCopySuccess(true)
      setTimeout(() => setShowCopySuccess(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
        aria-label="Close viewer"
      >
        ✕
      </button>

      {/* Previous button */}
      <button
        onClick={() => onNavigate("prev")}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
        aria-label="Previous image"
      >
        ←
      </button>

      {/* Next button */}
      <button
        onClick={() => onNavigate("next")}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
        aria-label="Next image"
      >
        →
      </button>

      {/* Image container */}
      <div className="relative max-w-full max-h-full">
        <Image
          src={currentImage.url}
          alt={`Photo ${currentIndex + 1} from ${albumTitle}`}
          width={1200}
          height={800}
          className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
          priority
        />
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg px-4 py-2">
        <span className="text-white text-sm">
          {currentIndex + 1} of {images.length}
        </span>

        <a
          href={currentImage.url}
          download={currentImage.key.split('/').pop() || `image-${currentIndex + 1}.jpg`}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors inline-block text-center"
        >
          Download
        </a>

        <button
          onClick={copyImageUrl}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          {showCopySuccess ? "Copied!" : "Copy URL"}
        </button>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  )
}

export default ImageViewer
