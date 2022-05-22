import createEmotionServer from '@emotion/server/create-instance'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import * as React from 'react'

import createEmotionCache from '../src/createEmotionCache'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon/favicon.svg" />
          {/*<link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />*/}
          {/*<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />*/}
          {/*<link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />*/}
          {/*<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />*/}
          {/*<link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />*/}
          {/*<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />*/}
          <link rel="manifest" href="/favicon/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        }
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags
  }
}
