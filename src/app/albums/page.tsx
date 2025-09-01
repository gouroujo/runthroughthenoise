import { load } from "outstatic/server"
import type { OstDocument } from "outstatic"

import markdownToHtml from "@/lib/markdownToHtml"
import Layout from "@/components/Layout"
import Header from "@/components/Header"
import AlbumGrid from "@/components/AlbumGrid"
import { title } from "process"

export default async function Index() {
  const { title, content, allAlbums } = await getData()
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
                <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {title}
            </h1>
            {content && (
              <div
                className="prose lg:prose-xl max-w-4xl mx-auto"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        {allAlbums.length > 0 && <AlbumGrid items={allAlbums} />}
        </div>
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: "pages", slug: "albums" }, ["content", "title"])
    .first()

  const content = page?.content ? await markdownToHtml(page.content) : ""

  const allAlbums = await db
    .find<OstDocument<{ folder: string }>>(
      {
        collection: "albums",
        status: "published",
      },
      ["title", "publishedAt", "slug", "coverImage", "description", "folder"],
    )
    .sort({ publishedAt: -1 })
    .toArray()

  return {
    title: page?.title || "Photos",
    content,
    allAlbums,
  }
}
