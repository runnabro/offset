import { useEffect, useState } from 'react';
import localFont from '@next/font/local';
import Head from 'next/head';
import Image from 'next/image';

import Input from '../components/Input';

import styles from '../styles/Home.module.scss';

const garamond = localFont({
  src: [{
    path: '../fonts/Garamond.ttf',
    style: 'normal',
    weight: '400',
  },
  {
    path: '../fonts/Garamond-Bold.ttf',
    style: 'normal',
    weight: '700',
  }],
  variable: '--garamond',
});

const airportOptions = {
  shouldSort: true,
  threshold: .4,
  maxPatternLength: 32,
  keys: [
    { name: 'IATA', weight: .6 },
    { name: 'name', weight: .2 },
    { name: 'city', weight: .4 }
  ]
};

// great circle using haversine formula
const convertDegreesToRadians = (degrees) => degrees * Math.PI / 180;
const calcDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  let dLat = convertDegreesToRadians(lat2 - lat1);
  let dLon = convertDegreesToRadians(lon2 - lon1);
  lat1 = convertDegreesToRadians(lat1);
  lat2 = convertDegreesToRadians(lat2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

const calcCarbon = distance => {
  let carbon = 0;
  distance = distance * 2; // assume round-trip
  distance = distance * .621371; // convert to miles

  // source: http://lipasto.vtt.fi/yksikkopaastot/henkiloliikennee/ilmaliikennee/ilmae.htm
  // if short-haul, 14.7 ounces/miles = .000416738 metric tonnes/mile
  // if long-haul, 10.1 ounces/miles = .0002863302 metric tonnes/mile
  if (distance < 288) carbon = distance * .000416738;
  else carbon = distance * .0002863302;

  // source: https://www.coolearth.org/cool-earth-carbon/ https://carbonfund.org/individuals/
  // Carbon Fund estimates they offset 1 metric tonne per $10 USD
  // Cool Earth estimates they mitigate 1 metric tonne per 25 pence (.32 USD in Dec 2018)
  // carbon impact by metric tonnes, offset cost, mitigation cost
  return carbon;
};

export default function Home() {
  const [carbonTotal, setCarbonTotal] = useState(0);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);


  useEffect(() => {
    const distance = calcDistance(origin?.lat, origin?.lon, destination?.lat, destination?.lon)
    if (distance) setCarbonTotal(calcCarbon(distance));
  }, [destination, origin]);

  return (
    <>
      <Head>
        <title>🌏✈️💨</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.jsdelivr.net/npm/airport-autocomplete-js@latest/dist/index.browser.min.js" />
      </Head>
      <main className={`${styles.Home} ${garamond.variable}`}>
        <section>
          <Input options={airportOptions} placeholder="Origin" setData={setOrigin} />
          <Input options={airportOptions} placeholder="Destination" setData={setDestination} />
          {carbonTotal.toFixed(2)} METRIC TONS
        </section>
      </main>
    </>
  );
};
