"use client"

import { useState } from "react"
import Image from "next/image"
import ImageViewer from "./ImageViewer"
import { S3Image } from "@/lib/s3"

type Props = {
  images: S3Image[]
  albumTitle: string
}

const ImageMosaic = ({ images, albumTitle }: Props) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  )

  const openViewer = (index: number) => {
    setSelectedImageIndex(index)
  }

  const closeViewer = () => {
    setSelectedImageIndex(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImageIndex === null) return

    if (direction === "prev") {
      setSelectedImageIndex(
        selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1,
      )
    } else {
      setSelectedImageIndex(
        selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0,
      )
    }
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <div
            key={image.key}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => openViewer(index)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <Image
                src={image.url}
                alt={`Photo ${index + 1} from ${albumTitle}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <ImageViewer
          images={images}
          currentIndex={selectedImageIndex}
          onClose={closeViewer}
          onNavigate={navigateImage}
          albumTitle={albumTitle}
        />
      )}
    </>
  )
}

export default ImageMosaic
