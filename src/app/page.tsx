import Image from 'next/image'
import Layout from '../components/Layout'
import {load} from 'outstatic/server'
import ContentGrid from '../components/ContentGrid'
import markdownToHtml from '../lib/markdownToHtml'

export default async function Index() {
    const {content, allPosts, allProjects} = await getData()

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
                            A journey around the world<br className="hidden md:block"/>
                            without
                            <span className="relative inline-block px-2 ml-2">
          <div className="absolute inset-0 transform -skew-x-12 bg-emerald-200"></div>
          <span className="relative text-emerald-900">taking planes</span>
        </span>
                        </h2>
                        <p className="mb-6 text-base text-indigo-100 md:text-lg">
                            Julie & Jonathan are running around the world with communities
                        </p>
                        <form className="flex flex-col items-center w-full mb-4 md:flex-row md:px-16">
                            <input
                                placeholder="Email"
                                required
                                type="text"
                                className="flex-grow w-full h-12 px-4 mb-3 text-white transition duration-200 border-2 border-transparent rounded appearance-none md:mr-2 md:mb-0 bg-stone-900 focus:border-emerald-700 focus:outline-none focus:shadow-outline"
                            />
                            <a
                                href="/"
                                className="inline-flex items-center justify-center w-full h-12 px-6 font-semibold tracking-wide text-emerald-900 transition duration-200 rounded shadow-md md:w-auto hover:text-stone-900 bg-emerald-400 hover:bg-emerald-700 focus:shadow-outline focus:outline-none"
                            >
                                Subscribe
                            </a>
                        </form>
                        <p className="max-w-md mb-10 text-xs tracking-wide text-indigo-100 sm:text-sm sm:mx-auto md:mb-16">
                            Stay up to date with the latest posts and projects or <br/><a href="https://instagram.com/juju_jojo" target="_blank" className="underline">follow us on Instagram</a>.
                        </p>
                        <a
                            href="/"
                            aria-label="Scroll down"
                            className="flex items-center justify-center w-10 h-10 mx-auto text-white duration-300 transform border border-gray-400 rounded-full hover:text-teal-accent-400 hover:border-teal-accent-400 hover:shadow hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                 fill="currentColor">
                                <path
                                    d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
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
        .find({collection: 'pages', slug: 'home'}, ['content'])
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
        content,
        allPosts,
        allProjects
    }
}
