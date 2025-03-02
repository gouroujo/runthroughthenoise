import { load } from "outstatic/server"
import markdownToHtml from "@/lib/markdownToHtml"
import Layout from "@/components/Layout"
import Header from "@/components/Header"
export default async function Index() {
  const { content } = await getData()
  return (
    <Layout>
      <Header />
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: "pages", slug: "about" }, ["content"])
    .first()

  const content = page?.content ? await markdownToHtml(page.content) : ""

  return {
    content,
  }
}
