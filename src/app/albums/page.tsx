import { load } from "outstatic/server"
import type { OstDocument } from "outstatic"

import markdownToHtml from "@/lib/markdownToHtml"
import Layout from "@/components/Layout"
import Header from "@/components/Header"
import AlbumGrid from "@/components/AlbumGrid"

export default async function Index() {
  const { content, allAlbums } = await getData()
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
        <div className="max-w-2xl mx-auto">
          <div
            className="prose lg:prose-xl mb-16"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        {allAlbums.length > 0 && <AlbumGrid items={allAlbums} />}
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: "pages", slug: "albums" }, ["content"])
    .first()

  const content = page?.content ? await markdownToHtml(page.content) : ""

  const allAlbums = await db
    .find<
      OstDocument<{ folder: string }>
    >({ collection: "albums" }, ["title", "publishedAt", "slug", "coverImage", "description", "folder"])
    .sort({ publishedAt: -1 })
    .toArray()

  return {
    content,
    allAlbums,
  }
}
