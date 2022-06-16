import { GetServerSideProps} from 'next'
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import styles from './home.module.scss'

interface HomeProps{
  product:{
    priceId: string,
    amount: number
  }
}

export default function Home({product}:HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, Welcome</span>
          <h1>News About <br/>the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br/>
            <span> for {
              !product &&'testing'|| new Intl.NumberFormat("en-US",{
                style:'currency',
                currency: 'USD'
              }).format(product.amount)
              } month</span>
          </p>
         <SubscribeButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl codding" />
      </main>
    </>
  )
}

// getStaticProps: GetStaticProps ou getServerSideProps:GetServerSideProps
export const getServerSideProps: GetServerSideProps = async() =>{
 try{ 
  const price = await stripe.prices.retrieve("price_1Km0A3HUBGnwpr0SN5DWqwJO",{
    expand: ['product']
  })
  const product ={
    priceId: price.id,
    amount: price.unit_amount/100,
  }

  return {
    props:{
      product ,},
      // revalidate: 60 * 60 * 24 //24 hours
  }
} catch(err)
  {console.log(err)}

  
}