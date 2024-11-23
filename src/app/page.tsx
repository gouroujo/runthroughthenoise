import Image from 'next/image'
import Layout from '../components/Layout'
import {load} from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '../lib/markdownToHtml'
import Link from "next/link";

export default async function Index() {
    const {cover, content, allPosts, allProjects} = await getData()

    return (
        <Layout>
            <section className="relative bg-primary">
                <div className="absolute inset-x-0 bottom-0">
                    <svg viewBox="0 0 224 12" fill="currentColor" className="w-full -mb-1 text-white"
                         preserveAspectRatio="none">
                        <path
                            d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z"></path>
                    </svg>
                </div>
                <div
                    className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
                    <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl text-center">
                        <Image
                            className="mx-auto"
                            src="/images/logo.png"
                            width={250}
                            height={250}
                            alt="Logo Run Through the Noise"
                        />
                        <h2 className="mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                            A journey around the world <br className="hidden md:block"/>
                            without
                            <span className="relative inline-block px-2 ml-2">
          <div className="absolute inset-0 transform -skew-x-12 bg-emerald-200"></div>
          <span className="relative text-emerald-900">taking planes</span>
        </span>
                        </h2>
                        <p className="mb-6 text-base text-indigo-100 md:text-lg">
                            Julie & Jonathan are running around the world with communities
                        </p>
                        <Link
                            href="https://instagram.com/juju_jojo"
                            target="_blank"
                            type="button"
                            className="mb-2 flex justify-center max-w-sm rounded btn-instagram px-6 py-2.5 border-white border-2 uppercase font-bold text-center mx-auto leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">
  <span className="me-2 [&>svg]:h-6 [&>svg]:w-6"
  ><svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 448 512">
      <path
          d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
  </span>
                            Follow us on Instagram !
                        </Link>
<p>or contact us on<Link href="mailto:jujujojo.run@gmail.com" className="underline text-emerald-200 text-center">jujujojo.run@gmail.com</Link></p>
                    </div>
                </div>
            </section>
            <section className="flex flex-row max-w-6xl mx-auto px-5 mb-8">
                <Image src={cover} alt="Julie & Jonathan on a boat"/>
                <div
                    className="prose lg:prose-xl text-justify"
                    dangerouslySetInnerHTML={{__html: content}}
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
        .find({collection: 'pages', slug: 'home'}, ['content','coverImage'])
        .first()

    const content = await markdownToHtml(page.content)

    const allPosts = await db
        .find({collection: 'posts'}, [
            'title',
            'publishedAt',
            'slug',
            'coverImage',
            'description',
            'tags'
        ])
        .sort({publishedAt: -1})
        .toArray()

    const allProjects = await db
        .find({collection: 'projects'}, ['title', 'slug', 'coverImage'])
        .sort({publishedAt: -1})
        .toArray()

    return {
        cover: page.coverImage,
        content,
        allPosts,
        allProjects
    }
}
