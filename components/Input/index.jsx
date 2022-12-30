import { useEffect, useRef, useState } from "react";

import mutationObserver from "../mutationObserver";

const Input = ({ options, placeholder, setData }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    AirportInput(placeholder, options);
  }, []);

  useEffect(() => {
    mutationObserver(inputRef.current, () => setData(inputRef.current.dataset));
  }, []);

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
