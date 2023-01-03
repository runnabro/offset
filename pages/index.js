import { useEffect, useState } from 'react';
import localFont from '@next/font/local';
import Head from 'next/head';
import { ArrowRight, Delete, Plus, Skull, Undo } from 'lucide-react';

import Input from '../components/Input';
import Spinner from '../components/Spinner';

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

const airportFormat = `<a class="flex col autocomplete-result $(unique-result)" single-result data-index="0">
<div class="flex autocomplete-title">$(name) <span class="autocomplete-iata">$(IATA)</span></div>
<div class="autocomplete-description">$(city), $(country)</div>
</a>`;

const airportOptions = {
  formatting: airportFormat,
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
    AirportInput(`origin-${index}`, airportOptions);
    AirportInput(`destination-${index}`, airportOptions);

    // disable when filled
    const hasDestination = Object.keys(data[index].destination).length !== 0;
    const hasOrigin = Object.keys(data[index].origin).length !== 0;
    if (hasDestination && hasOrigin) setIsDisabled(true);
  }, [data]);

  return (
    <>
      <td>
        <Input data={data} index={index} isDisabled={isDisabled} name="origin" placeholder="SFO" setData={setData} />
      </td>
      <td>
        <Input data={data} index={index} isDisabled={isDisabled} name="destination" placeholder="JFK" setData={setData} />
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
  const [rowLength, setRowLength] = useState(data.length);

  const handleNewRow = () => {
    if (hasPrevRow) {
      setData(prev => [...prev, {
        carbon: 0,
        deleted: false,
        destination: {},
        id: data.length,
        origin: {},
      }]);
      setRowLength(rowLength + 1);
    }
  };

  const handleDeleteRow = index => {
    let newData = data.map((flight) => {
      if (flight?.id === index) flight.deleted = true;
      return flight;
    });
    setData(newData);
    setRowLength(rowLength - 1);
  };

  const handleClear = () => location.reload();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000)
      return () => clearTimeout(timer);
    }
  });

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
        <title>🛩️</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.jsdelivr.net/npm/airport-autocomplete-js@latest/dist/index.browser.min.js" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {loading && <Spinner />}
      <main className={`${styles.Home} ${garamond.variable}`}>
        <table className={styles.Table}>
          <thead>
            <tr>
              <th>
                <div className="flex align-center justify-justified">
                  Origin <ArrowRight size="12" />
                </div>
              </th>
              <th>Destination </th>
              <th>
                <div className="flex align-center">
                  CO₂
                  <Skull size="12" />
                </div>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.map(({ carbon, deleted }, index) => {
              return (
                <tr key={index} className={deleted ? styles['Flight_deleted'] : ''}>
                  <InputGroup key={index} data={data} index={index} setData={setData} />
                  <td className={styles['Table-total']}>{carbon ? carbon.toFixed(2) : ''}{carbon ? 't' : ''}</td>
                  <td>
                    <button
                      className={styles['Table-delete']}
                      disabled={rowLength === 1}
                      onClick={() => handleDeleteRow(index)}
                      type="button"
                    >
                      <Delete size="15" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <button
                  aria-label="Add Row"
                  className={styles['Table-button']}
                  disabled={!hasPrevRow}
                  onClick={handleNewRow}
                  type="button"
                >
                  <Plus size="12" />
                </button>
              </td>
              <td />
              <td className={styles['Table-total']}>{carbonTotal}t Total</td>
              <td>
                <button
                  aria-label="Reset"
                  className={`${styles['Table-delete']} ${styles['Table-reset']}`}
                  onClick={handleClear}
                  type="button"
                >
                  <Undo size="12" />
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </main>
    </>
  );
};
