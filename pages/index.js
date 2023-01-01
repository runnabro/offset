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
  maxPatternLength: 32,
  shouldSort: true,
  threshold: .4,
  keys: [
    { name: 'IATA', weight: .25 },
    { name: 'name', weight: .25 },
    { name: 'city', weight: .5 }
  ]
};

const InputGroup = ({ data, index, setData }) => {
  useEffect(() => {
    AirportInput(`Origin-${index}`, airportOptions);
    AirportInput(`Destination-${index}`, airportOptions);
  }, [data]);

  return (
    <form className="flex">
      <Input data={data} index={index} name="origin" placeholder="Origin" setData={setData} />
      <Input data={data} index={index} name="destination" placeholder="Destination" setData={setData} />
    </form>
  );
};

export default function Home() {
  const [carbonTotal, setCarbonTotal] = useState(0);
  const initArr = [{
    carbon: 0,
    destination: {},
    id: 0,
    origin: {},
  }];
  const [data, setData] = useState(initArr);

  const handleNewRow = () => {
    setData(prev => [...prev, {
      deleted: false,
      destination: {},
      id: data.length,
      origin: {},
    }]);
  };

  const handleDeleteRow = index => {
    let newData = data.map((flight) => {
      if (flight?.id === index) flight.deleted = true;
      return flight;
    });
    setData(newData);
  };

  const handleClear = () => location.reload();

  useEffect(() => {
    const newCarbonTotal = data.reduce((n, { carbon, deleted }) => !deleted ? n + carbon : n, 0);
    if (isNaN(newCarbonTotal)) return;
    setCarbonTotal(newCarbonTotal.toFixed(2));
  }, [data]);

  return (
    <>
      <Head>
        <title>🌏✈️💨</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.jsdelivr.net/npm/airport-autocomplete-js@latest/dist/index.browser.min.js" />
      </Head>
      <main className={`${styles.Home} ${garamond.variable}`}>
        {data.map(({ carbon, deleted }, index) => {
          return (
            <div key={index} className={`flex ${deleted ? styles['Flight_deleted'] : ''}`}>
              <InputGroup key={index} data={data} index={index} setData={setData} />
              {carbon ? carbon.toFixed(2) : 0} METRIC TONS
              {data.length > 1 && <button onClick={() => handleDeleteRow(index)} type="button">DELETE</button>}
            </div>
          )
        })}
        <div>{carbonTotal} METRIC TONS</div>
        <button onClick={handleNewRow} type="button">Add Another</button>
        <button onClick={handleClear} type="button">Start Over</button>
      </main>
    </>
  );
};
