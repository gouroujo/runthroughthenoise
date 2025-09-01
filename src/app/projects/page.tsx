import { load } from "outstatic/server"
import markdownToHtml from "@/lib/markdownToHtml"
import Layout from "@/components/Layout"
import Header from "@/components/Header"
import ContentList from "@/components/ContentList"
import { tileLayer } from "leaflet"
import { title } from "process"

export default async function Index() {
  const { title, content, allProjects } = await getData()
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
            {content && (
              <div
                className="prose lg:prose-xl max-w-4xl mx-auto text-center mb-12"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          <ContentList
            collection="projects"
            items={allProjects}
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
    .find({ collection: "pages", slug: "projects" }, ["content", "title"])
    .first()

  const content = page?.content ? await markdownToHtml(page.content) : ""

  const allProjects = await db
    .find({ collection: "projects" }, [
      "title",
      "slug",
      "coverImage",
      "description",
      "publishedAt",
      "tags",
      "content",
    ])
    .sort({ publishedAt: -1 })
    .toArray()

  return {
    title: page?.title || "Projects",
    content,
    allProjects,
  }
}
