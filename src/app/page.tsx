import Image from "next/image"
import Layout from "../components/Layout"
import { load } from "outstatic/server"
import ContentGrid from "../components/ContentGrid"
import markdownToHtml from "../lib/markdownToHtml"
import Hero from "../components/Hero"
import { Location } from "@/components/WorldMap"

export default async function Index() {
  const { cover, content, allPosts, allProjects, allLocations, allAlbums } =
    await getData()

  return (
    <Layout>
      <Hero locations={allLocations} />

      <section className="max-w-6xl mx-auto px-5 py-2 flex flex-col md:flex-row items-start gap-8">
        {cover && (
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <Image
              width={400}
              height={500}
              className="rounded-lg shadow-lg object-cover w-full max-h-[300px]"
              src={cover}
              alt="Julie & Jonathan around the world"
              priority
            />
          </div>
        )}
        <div
          className="flex-1 prose lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </section>

      <div className="max-w-6xl mx-auto px-5">
        {allPosts.length > 0 && (
          <ContentGrid
            title="Posts"
            items={allPosts}
            collection="posts"
            priority
          />
        )}
        {allProjects.length > 0 && (
          <ContentGrid
            title="Projects"
            items={allProjects}
            collection="projects"
          />
        )}

        {allAlbums.length > 0 && (
          <ContentGrid title="Albums" items={allAlbums} collection="projects" />
        )}
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: "pages", slug: "home" }, ["content", "coverImage"])
    .first()
  const content = await markdownToHtml(page?.content || "")

  console.log("Content page:", content)

  const allPosts = await db
    .find(
      {
        collection: "posts",
        status: "published",
      },
      ["title", "publishedAt", "slug", "coverImage", "description", "author"],
    )
    .sort({ publishedAt: -1 })
    .limit(3)
    .toArray()

  const allProjects = await db
    .find(
      {
        collection: "projects",
        status: "published",
      },
      ["title", "publishedAt", "slug", "coverImage", "description"],
    )
    .sort({ publishedAt: -1 })
    .limit(3)
    .toArray()

  // Fetch locations from Outstatic
  const allLocationsRaw = await db
    .find(
      {
        collection: "locations",
        status: "published",
      },
      ["title", "description", "latitude", "longitude", "publishedAt"],
    )
    .sort({ publishedAt: 1 })
    .toArray()

  // Transform the raw data to ensure it matches our Location type
  const allLocations: Location[] = allLocationsRaw.map((loc: any) => ({
    title: loc.title || "",
    description: loc.description || "",
    latitude: String(loc.latitude || "0"),
    longitude: String(loc.longitude || "0"),
    publishedAt: loc.publishedAt || new Date().toISOString(),
  }))

  // Fetch latest album
  const allAlbums = await db
    .find(
      {
        collection: "albums",
        status: "published",
      },
      ["title", "publishedAt", "slug", "coverImage", "description", "folder"],
    )
    .sort({ publishedAt: -1 })
    .limit(3)
    .toArray()

  return {
    content,
    cover: page?.coverImage || "",
    allPosts,
    allProjects,
    allLocations,
    allAlbums,
  }
}
