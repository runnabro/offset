import { useEffect, useState } from 'react';
import localFont from '@next/font/local';
import Head from 'next/head';

import Input from '../components/Input';
import FlightMap from '../components/FlightMap';

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
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    AirportInput(`Origin-${index}`, airportOptions);
    AirportInput(`Destination-${index}`, airportOptions);

    // disable when filled
    const hasDestination = Object.keys(data[index].destination).length !== 0;
    const hasOrigin = Object.keys(data[index].origin).length !== 0;
    if (hasDestination && hasOrigin) setIsDisabled(true);
  }, [data]);

  return (
    <>
      <td>
        <Input data={data} index={index} isDisabled={isDisabled} name="origin" placeholder="Origin" setData={setData} />
      </td>
      <td>
        <Input data={data} index={index} isDisabled={isDisabled} name="destination" placeholder="Destination" setData={setData} />
      </td>
    </>
  );
};

export default function Home() {
  const [carbonTotal, setCarbonTotal] = useState(0);
  const [hasPrevRow, setHasPrevRow] = useState(false);
  const initArr = [{
    carbon: 0,
    deleted: false,
    destination: {},
    id: 0,
    origin: {},
  }];
  const [data, setData] = useState(initArr);

  const handleNewRow = () => {
    if (hasPrevRow) {
      setData(prev => [...prev, {
        carbon: 0,
        deleted: false,
        destination: {},
        id: data.length,
        origin: {},
      }]);
    }
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
    // only add a new row if the previous row is filled out
    const hasPrevRowDestination = Object.keys(data.at(-1).destination).length !== 0;
    const hasPrevRowOrigin = Object.keys(data.at(-1).origin).length !== 0;
    setHasPrevRow(hasPrevRowDestination && hasPrevRowOrigin);

    // calculate carbon total
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
        <table>
          <tbody>
            {data.map(({ carbon, deleted }, index) => {
              return (
                <tr key={index} className={deleted ? styles['Flight_deleted'] : ''}>
                  <InputGroup key={index} data={data} index={index} setData={setData} />
                  <td>{carbon ? carbon.toFixed(2) : 0} METRIC TONS</td>
                  <td>{data.length > 1 && <button onClick={() => handleDeleteRow(index)} type="button">DELETE</button>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div>{carbonTotal} METRIC TONS</div>
        <button disabled={!hasPrevRow} onClick={handleNewRow} type="button">Add Another</button>
        <button onClick={handleClear} type="button">Start Over</button>
        <FlightMap />
      </main>
    </>
  );
};
