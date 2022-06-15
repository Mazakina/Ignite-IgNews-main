import Document, { Html, Head, Main, NextScript} from 'next/document'

export default class MyDocument extends Document{
    render(){
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;500;600;700;800;900&display=swap" rel="stylesheet"></link>
                    <link rel="shortcut icon" href="/images/favicon.png" type="image/png" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}