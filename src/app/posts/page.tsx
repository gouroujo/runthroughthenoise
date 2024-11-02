import {load} from "outstatic/server";
import markdownToHtml from "@/lib/markdownToHtml";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
export default async function Index() {
    const {content, allPosts} = await getData()
    return (
        <Layout>
            <Header />
        </Layout>
            )
}

async function getData() {
    const db = await load()

    const page = await db
        .find({collection: 'pages', slug: 'posts'}, ['content'])
        .first()

    const content = page?.content ? await markdownToHtml(page.content) : ''

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


    return {
        content,
        allPosts,
    }
}
