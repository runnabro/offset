import Script from 'next/script';

import '../styles/globals.scss'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        async
        crossorigin
        data-callback="initMapKit"
        data-initial-token={process.env.MAPKIT_TOKEN}
        data-libraries="services,full-map,geojson"
        strategy="beforeInteractive"
        src="//cdn.apple-mapkit.com/mk/5.x.x/mapkit.core.js"
      />
      <Script strategy="beforeInteractive" src="https://cdn.jsdelivr.net/npm/airport-autocomplete-js@latest/dist/index.browser.min.js" />
      <Component {...pageProps} />
    </>
  );
}
