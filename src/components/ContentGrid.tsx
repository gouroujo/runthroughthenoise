import type { OstDocument } from "outstatic"
import Link from "next/link"
import Image from "next/image"
import DateFormatter from "@/components/DateFormatter"

type Item = {
  tags?: { value: string; label: string }[]
} & OstDocument

type Props = {
  collection: "posts" | "projects"
  title?: string
  items: Item[]
  priority?: boolean
}

const ContentGrid = ({
  title = "More",
  items,
  collection,
  priority = false,
}: Props) => (
  <section id={collection}>
    <h2 className="mb-8 text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-8 mb-8 auto-rows-fr">
      {items.map((item, id) => (
        <Link
          key={item.slug}
          href={`/${collection}/${item.slug}`}
          className="h-full"
        >
          <div className="flex flex-col h-full cursor-pointer border project-card rounded-md md:w-full scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu transition duration-100 motion-reduce:hover:scale-100 hover:shadow overflow-hidden">
            <div className="sm:mx-0 relative">
              <Image
                src={item.coverImage ?? ""}
                alt={`Cover Image for ${item.title}`}
                className="object-cover object-center w-full h-[250px]"
                width={800}
                height={250}
                sizes="(min-width: 768px) 347px, 192px"
                priority={priority && id <= 2}
              />
              {collection === "projects" && (
                <h2 className="p-2 bg-opacity-80 bg-white text-center whitespace-nowrap font-bold text-3xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 shadow-lg rounded-lg">
                  {item.title}
                </h2>
              )}
            </div>
            {collection === "posts" && (
              <div className="p-5 flex flex-col flex-grow">
                <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
                  <span className="text-gray-600">
                    <DateFormatter dateString={item.publishedAt} />
                  </span>
                </p>
                <h3 className="inline-block mb-3 text-2xl font-bold leading-5 transition-colors duration-200 hover:text-deep-purple-accent-700">
                  {item.title}
                </h3>
                <p className="mb-2 text-gray-700">{item.description}</p>
                <span className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800">
                  Learn more
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  </section>
)

export default ContentGrid
