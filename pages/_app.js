import Script from 'next/script';

import '../styles/globals.scss';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script strategy="beforeInteractive" src="https://cdn.jsdelivr.net/npm/airport-autocomplete-js@latest/dist/index.browser.min.js" />
      <Component {...pageProps} />
    </>
  );
};
