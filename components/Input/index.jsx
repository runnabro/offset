import { useEffect, useRef, useState } from "react";

import mutationObserver from "../mutationObserver";

const Input = ({ data, index, options, placeholder, setData }) => {
  const inputRef = useRef(null);
  const name = placeholder === "Destination" ? "destination" : "origin";

  useEffect(() => {
    AirportInput(placeholder, options);
  }, []);

  useEffect(() => {
    mutationObserver(inputRef.current, handleChange);
  }, []);

  const handleChange = () => {
    let newData = data.map((flight) => {
      if (flight.id === index) flight[name] = inputRef.current.dataset;
      return flight;
    });
    setData(newData);
  };

  return (
    <input
      id={placeholder}
      placeholder={placeholder}
      ref={inputRef}
      spellCheck="false"
    />
  );
};

export default Input;
