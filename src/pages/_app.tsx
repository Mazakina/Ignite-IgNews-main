import "../../styles/global.scss"
import {AppProps} from 'next/app'
import { SessionProvider as NextAuthProvider } from 'next-auth/react'
import { Header } from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {

  return(
    <NextAuthProvider session={pageProps.session}>
      <Header/>
      <Component {...pageProps} />
    </NextAuthProvider>
    )
}

export default MyApp
