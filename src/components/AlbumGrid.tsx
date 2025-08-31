import type { OstDocument } from "outstatic"
import Link from "next/link"
import Image from "next/image"
import DateFormatter from "@/components/DateFormatter"
import { getImagesFromFolder } from "@/lib/s3"

type Props = {
  title?: string
  items: OstDocument[]
  priority?: boolean
}

const AlbumGrid = async ({
  title = "Albums",
  items,
  priority = false,
}: Props) => (
  <section id="albums">
    <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-8 mb-8 auto-rows-fr">
      {items.map((album, id) => (
        <Link
          key={album.slug}
          href={`/albums/${album.slug}`}
          className="h-full"
        >
          <div className="flex flex-col h-full cursor-pointer border project-card rounded-md md:w-full scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 hover:shadow overflow-hidden">
            <div className="sm:mx-0 relative">
              {album.coverImage ? (
                <Image
                  src={album.coverImage}
                  alt={`Cover Image for ${album.title}`}
                  className="object-cover object-center w-full h-[250px]"
                  width={800}
                  height={250}
                  sizes="(min-width: 768px) 347px, 192px"
                  priority={priority && id <= 2}
                />
              ) : (
                <div className="w-full h-[250px] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No cover</span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
                <span className="text-gray-600">
                  <DateFormatter dateString={album.publishedAt} />
                </span>
              </p>
              <h3 className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">
                {album.title}
              </h3>
              <p className="mb-2 text-gray-700">{album.description}</p>
              <span className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">
                View album
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
)

export default AlbumGrid
