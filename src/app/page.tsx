import Image from "next/image"
import Layout from "../components/Layout"
import { load } from "outstatic/server"
import ContentGrid from "../components/ContentGrid"
import markdownToHtml from "../lib/markdownToHtml"
import Hero from "../components/Hero"
import MapContainer from "../components/MapContainer"
import { Location } from "@/components/WorldMap"

export default async function Index() {
  const { cover, content, allPosts, allProjects, allLocations } =
    await getData()

  return (
    <Layout>
      <Hero />

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Our Journey Around the World
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow Julie &amp; Jonathan&apos;s running adventures across
              continents, connecting communities and inspiring change.
            </p>
          </div>

          <MapContainer locations={allLocations} />
        </div>
      </section>

      <section className="flex flex-wrap max-w-full mx-auto px-5 my-16 bg-emerald-50 py-12 rounded-lg">
        {cover && (
          <Image
            width={2268}
            height={4032}
            className="md:mr-2 w-full md:w-1/2 rounded-lg shadow-xl"
            src={cover}
            alt="Julie & Jonathan on a boat"
          />
        )}
        <div
          className="flex-1 prose lg:prose-xl text-justify md:pl-6 pt-8 md:pt-0"
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
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: "pages", slug: "about" }, ["content", "coverImage"])
    .first()

  const content = await markdownToHtml(page?.content || "")

  const allPosts = await db
    .find(
      {
        collection: "posts",
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
    .sort({ publishedAt: -1 })
    .toArray()

  // Transform the raw data to ensure it matches our Location type
  const allLocations: Location[] = allLocationsRaw.map((loc) => ({
    title: loc.title || "",
    description: loc.description || "",
    latitude: String(loc.latitude || "0"),
    longitude: String(loc.longitude || "0"),
    publishedAt: loc.publishedAt || new Date().toISOString(),
  }))

  return {
    content,
    cover: page?.coverImage || "",
    allPosts,
    allProjects,
    allLocations,
  }
}
