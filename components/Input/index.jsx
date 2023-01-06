import { useEffect, useRef, useState } from "react";

import mutationObserver from "../mutationObserver";

import styles from "./style.module.scss";

// great circle using haversine formula
const convertDegreesToRadians = (degrees) => (degrees * Math.PI) / 180;
const calcDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  let dLat = convertDegreesToRadians(lat2 - lat1);
  let dLon = convertDegreesToRadians(lon2 - lon1);
  lat1 = convertDegreesToRadians(lat1);
  lat2 = convertDegreesToRadians(lat2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const calcCarbon = (distance, roundTrip) => {
  // https://theicct.org/sites/default/files/publications/CO2-commercial-aviation-oct2020.pdf
  // 3.3 Passenger CO₂ emissions and intensity by aircraft class, pg 12, 2018
  const regionalAvgDistance = 581; // in km
  const narrowBodyAvgDistance = 1317;
  const widebodyAvgDistance = 4696;
  const regionalEmissionKm = 0.000154; // in metric tons
  const narrowBodyEmissionKm = 0.000086;
  const wideBodyEmissionKm = 0.000092;
  const regionalLimit = (regionalAvgDistance + narrowBodyAvgDistance) / 2;
  const narrowBodyLimit = (narrowBodyAvgDistance + widebodyAvgDistance) / 2;
  let carbon = 0;

  // calculate emissions
  if (distance < regionalLimit) carbon = distance * regionalEmissionKm;
  else if (distance < narrowBodyLimit) carbon = distance * narrowBodyEmissionKm;
  else carbon = distance * wideBodyEmissionKm;
  if (roundTrip) carbon = carbon * 2;

  return carbon;
};

const Input = ({
  data,
  index,
  isDisabled,
  name,
  placeholder,
  setData,
  type,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (type !== "checkbox") {
      mutationObserver(inputRef.current, () => handleChange());
    }
  }, []);

  // coordinates
  const [dataset, setDataset] = useState({});
  const handleChange = () => setDataset(inputRef.current.dataset);

  // round trip?
  const [roundTrip, setRoundTrip] = useState(true);
  const handleCheck = (e) => setRoundTrip(!roundTrip);

  // update data
  useEffect(() => {
    let newData = data.map((flight) => {
      if (flight?.id === index) {
        flight[name] = dataset;
        flight.roundTrip = roundTrip;
        const hasOrigin = Object.keys(flight.destination).length !== 0;
        const hasDestination = Object.keys(flight.origin).length !== 0;
        if (hasOrigin && hasDestination) {
          flight.carbon = calcCarbon(
            calcDistance(
              flight.origin.lat,
              flight.origin.lon,
              flight.destination.lat,
              flight.destination.lon
            ),
            flight.roundTrip
          );
        }
      }
      return flight;
    });
    setData(newData);
  }, [dataset, roundTrip]);

  if (type === "checkbox") {
    return (
      <div className={styles["Input-wrapper"]}>
        <input
          className={`${styles.Input} ${styles["Input_checkbox"]}`}
          checked={roundTrip}
          onChange={(e) => handleCheck(e)}
          type={type}
        />
      </div>
    );
  }

  return (
    <input
      id={`${name}-${index}`}
      className={styles.Input}
      disabled={isDisabled}
      placeholder={placeholder}
      ref={inputRef}
      spellCheck="false"
    />
  );
};

export default Input;
