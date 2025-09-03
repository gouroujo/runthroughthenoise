import DateFormatter from '@/components/DateFormatter'
import Header from '@/components/Header'
import ImageMosaic from '@/components/ImageMosaic'
import Layout from '@/components/Layout'
import markdownToHtml from '@/lib/markdownToHtml'
import { getImagesFromFolder } from '@/lib/s3'
import { absoluteUrl } from '@/lib/utils'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OstDocument } from 'outstatic'
import { getDocumentSlugs, load } from 'outstatic/server'

type Album = {
  folder: string
} & OstDocument

interface Params {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(params: Params): Promise<Metadata> {
  const { album } = await getData(params)

  if (!album) {
    return {}
  }

  return {
    title: album.title,
    description: album.description,
    openGraph: {
      title: album.title,
      description: album.description,
      type: 'article',
      url: absoluteUrl(`/albums/${album.slug}`),
      images: [
        {
          url: absoluteUrl(album?.coverImage || '/images/og-image.png'),
          width: 1200,
          height: 630,
          alt: album.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: album.title,
      description: album.description,
      images: absoluteUrl(album?.coverImage || '/images/og-image.png'),
    },
  }
}

export default async function Album(params: Params) {
  const { album, images, content } = await getData(params)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5">
        <Header />
        <article className="mb-8">
          <div className="mb-8">
            <h1 className="font-primary text-4xl font-bold md:text-6xl mb-4 text-center">
              {album.title}
            </h1>
            <div className="text-center text-slate-600 mb-4">
              Published on <DateFormatter dateString={album.publishedAt} />
            </div>
            {album.description && (
              <div className="text-center max-w-2xl mx-auto mb-8">
                <p className="text-lg text-gray-700">{album.description}</p>
              </div>
            )}
            {content && (
              <div className="max-w-2xl mx-auto mb-8">
                <div
                  className="prose lg:prose-xl"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            )}
          </div>

          {images.length > 0 ? (
            <ImageMosaic images={images} albumTitle={album.title} />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600">No images found in this album.</p>
            </div>
          )}
        </article>
      </div>
    </Layout>
  )
}

async function getData({ params }: Params) {
  const resolvedParams = await params
  const db = await load()
  const album = await db
    .find<Album>({ collection: 'albums', slug: resolvedParams.slug }, [
      'title',
      'publishedAt',
      'description',
      'slug',
      'author',
      'content',
      'coverImage',
      'folder',
    ])
    .first()

  if (!album) {
    notFound()
  }

  const content = await markdownToHtml(album.content || '')
  const images = await getImagesFromFolder(album.folder)

  return {
    album,
    images,
    content,
  }
}

export async function generateStaticParams() {
  const albums = getDocumentSlugs('albums')
  return albums.map((slug: string) => ({ slug }))
}
