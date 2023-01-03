import { useEffect, useRef } from "react";

import mutationObserver from "../mutationObserver";

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

const calcCarbon = (distance) => {
  let carbon = 0;
  distance = distance * 2; // assume round-trip
  distance = distance * 0.621371; // convert to miles

  // source: http://lipasto.vtt.fi/yksikkopaastot/henkiloliikennee/ilmaliikennee/ilmae.htm
  // if short-haul, 14.7 ounces/miles = .000416738 metric tonnes/mile
  // if long-haul, 10.1 ounces/miles = .0002863302 metric tonnes/mile
  if (distance < 288) carbon = distance * 0.000416738;
  else carbon = distance * 0.0002863302;

  // source: https://www.coolearth.org/cool-earth-carbon/ https://carbonfund.org/individuals/
  // Carbon Fund estimates they offset 1 metric tonne per $10 USD
  // Cool Earth estimates they mitigate 1 metric tonne per 25 pence (.32 USD in Dec 2018)
  // carbon impact by metric tonnes, offset cost, mitigation cost
  return carbon;
};

const Input = ({ data, index, isDisabled, placeholder, setData }) => {
  const inputRef = useRef(null);
  const name = placeholder === "Destination" ? "destination" : "origin";

  useEffect(() => {
    mutationObserver(inputRef.current, () =>
      handleChange(index, inputRef.current.dataset)
    );
  }, []);

  const handleChange = (index, dataset) => {
    let newData = data.map((flight) => {
      if (flight?.id === index) {
        flight[name] = inputRef.current.dataset;
        flight.carbon = calcCarbon(
          calcDistance(
            flight.origin.lat,
            flight.origin.lon,
            flight.destination.lat,
            flight.destination.lon
          )
        );
      }
      return flight;
    });
    setData(newData);
  };

  return (
    <input
      id={`${placeholder}-${index}`}
      disabled={isDisabled}
      placeholder={placeholder}
      ref={inputRef}
      spellCheck="false"
    />
  );
};

export default Input;
