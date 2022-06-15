import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from './styles.module.scss'
import {getPrismicClient} from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Link from 'next/link'

type posts={
    slug:string,
    title: string,
    excerpt: string,
    updatedAt: string
}

interface postProps{
    post: posts[]
}


export default function Posts({posts}) {
    return(
        <>
            <Head>
                <title>Post | IgNews</title>
            </Head>

        <main className={styles.container}>
          <div className={styles.posts}>
                {posts.map((post)=>(
                    <Link key={post.slug} href={`/posts/${post.slug}`}>
                        <a  > 
                            <time>{post.updatedAt}</time>
                            <strong> {post.title}</strong>
                            <p>{post.excerpt}</p>
                        </a>
                    </Link>
                ))}
           </div>

        </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ()=>{
    const prismic = getPrismicClient()
    const postsResponse = await prismic.query<any>([
            Prismic.Predicates.at('document.type', 'Posts')
        ], {
            fetch: [ 'posts.type', 'posts.content'],
            pageSize: 100,
        }
    )

    const posts = postsResponse.results.map(post =>{
        // console.log(post.data.content)

        return {
            slug:post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content=> content.type === 'paragraph' && content.text !== '')?.text ?? 'asdasd',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year:'numeric'
            })
        }
    })


    return({
        props:{posts}
    })
}