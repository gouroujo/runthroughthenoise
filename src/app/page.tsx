import Image from 'next/image'
import Script from 'next/script'

import { Location } from '@/components/WorldMap'
import { load } from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import markdownToHtml from '../lib/markdownToHtml'

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
      <section className="max-w-4xl mx-auto px-5 my-8 bg-primary p-6 md:rounded-lg md:shadow-md">
        <iframe
          data-w-type="embedded"
          frameBorder={0}
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://s9rxp.mjt.lu/wgt/s9rxp/0m17/form?c=2b096bb9"
          width="100%"
          style={{ height: 0 }}
        ></iframe>

        <Script
          type="text/javascript"
          src="https://app.mailjet.com/pas-nc-embedded-v1.js"
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
          <ContentGrid title="Photos" items={allAlbums} collection="albums" />
        )}
      </div>
    </Layout>
  )
}

async function getData() {
  const db = await load()

  const page = await db
    .find({ collection: 'pages', slug: 'home' }, ['content', 'coverImage'])
    .first()
  const content = await markdownToHtml(page?.content || '')
  const allPosts = await db
    .find(
      {
        collection: 'posts',
        status: 'published',
      },
      ['title', 'publishedAt', 'slug', 'coverImage', 'description', 'author'],
    )
    .sort({ publishedAt: -1 })
    .toArray()

  const allProjects = await db
    .find(
      {
        collection: 'projects',
        status: 'published',
      },
      ['title', 'publishedAt', 'slug', 'coverImage', 'description'],
    )
    .sort({ publishedAt: -1 })
    .toArray()

  // Fetch locations from Outstatic
  const allLocationsRaw = await db
    .find(
      {
        collection: 'locations',
        status: 'published',
      },
      ['title', 'description', 'latitude', 'longitude', 'publishedAt'],
    )
    .sort({ publishedAt: 1 })
    .toArray()

  // Transform the raw data to ensure it matches our Location type
  const allLocations: Location[] = allLocationsRaw.map((loc: any) => ({
    title: loc.title || '',
    description: loc.description || '',
    latitude: String(loc.latitude || '0'),
    longitude: String(loc.longitude || '0'),
    publishedAt: loc.publishedAt || new Date().toISOString(),
  }))

  // Fetch latest album
  const allAlbums = await db
    .find(
      {
        collection: 'albums',
        status: 'published',
      },
      ['title', 'publishedAt', 'slug', 'coverImage', 'description', 'folder'],
    )
    .sort({ publishedAt: -1 })
    .toArray()

  return {
    content,
    cover: page?.coverImage || '',
    allPosts,
    allProjects,
    allLocations,
    allAlbums,
  }
}
