import { load } from "outstatic/server"
import markdownToHtml from "@/lib/markdownToHtml"
import Layout from "@/components/Layout"
import Header from "@/components/Header"
import ContentList from "@/components/ContentList"

export default async function Index() {
  const { title, content, allPosts } = await getData()
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
          <ContentList
            collection="posts"
            items={allPosts}
            priority={true}
          />
        </div>
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: "pages", slug: "posts" }, ["content", "title"])
    .first()

  const content = page?.content ? await markdownToHtml(page.content) : ""

  const allPosts = await db
    .find({ collection: "posts" }, [
      "title",
      "publishedAt",
      "slug",
      "coverImage",
      "description",
      "tags",
      "content",
    ])
    .sort({ publishedAt: -1 })
    .toArray()

  return {
    title: page?.title || "Posts",
    content,
    allPosts,
  }
}
