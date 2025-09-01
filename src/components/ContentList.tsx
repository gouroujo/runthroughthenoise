import type { OstDocument } from "outstatic"
import Link from "next/link"
import Image from "next/image"
import DateFormatter from "@/components/DateFormatter"

type Item = {
  tags?: { value: string; label: string }[]
  content?: string
} & OstDocument

type Props = {
  collection: "posts" | "projects"
  items: Item[]
  priority?: boolean
}

const truncateContent = (content: string, maxLines: number = 3): string => {
  // Remove HTML tags and convert to plain text
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Estimate characters per line (roughly 80-100 chars)
  const maxChars = maxLines * 90

  if (plainText.length <= maxChars) {
    return plainText
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxChars)
  const lastSpace = truncated.lastIndexOf(" ")

  return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated
}

const ContentList = ({ items, collection, priority = false }: Props) => (
  <div className="mb-16">
    {items.length > 0 ? (
      <div className="space-y-8">
        {items.map((item, id) => (
          <Link
            key={item.slug}
            href={`/${collection}/${item.slug}`}
            className="group block"
          >
            <article className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 p-6">
              {/* Image */}
              <div className="relative w-full md:w-80 h-48 md:h-56 flex-shrink-0">
                {item.coverImage && (
                  <Image
                    src={item.coverImage}
                    alt={`Cover Image for ${item.title}`}
                    className="object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-200"
                    fill
                    sizes="(min-width: 768px) 320px, 100vw"
                    priority={priority && id <= 2}
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-0">
                <div>
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      {item.publishedAt && (
                        <time className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          <DateFormatter dateString={item.publishedAt} />
                        </time>
                      )}
                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.value}
                              className="inline-block bg-blue-50 text-blue-600 rounded-full px-2 py-1 text-xs font-medium"
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="text-gray-700 text-base mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Content Preview */}
                  {item.content && (
                    <div className="text-gray-600 text-sm leading-relaxed mb-4">
                      <p>{truncateContent(item.content)}...</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-800 transition-colors">
                    {collection === "posts" ? "Read more" : "View project"} →
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No {collection} found
          </h3>
          <p className="text-gray-500">
            {collection === "posts"
              ? "Check back soon for new blog posts!"
              : "Check back soon for new projects!"}
          </p>
        </div>
      </div>
    )}
  </div>
)

export default ContentList
