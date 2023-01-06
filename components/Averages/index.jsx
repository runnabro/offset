import { useEffect, useState } from "react";
import Explainer from "../Explainer";

import styles from "./style.module.scss";

const Averages = ({ carbonTotal }) => {
  // in metrics tons
  // https://ourworldindata.org/carbon-footprint-flying
  const avgAmericanFlights = 0.58354;
  const avgAmerican = 18.01;
  const [you, setYou] = useState(0);

  useEffect(() => {
    setYou(`${(carbonTotal * 100) / avgAmerican}%`);
  }, [carbonTotal]);

  return (
    <figure className={`Card ${styles.Averages}`}>
      <figcaption className={styles["Averages-title"]}>
        You vs. The Average American
      </figcaption>
      <div className={styles["Averages-meter"]}>
        <div
          className={styles["Averages-meter-progress"]}
          style={{ width: you }}
        >
          <div
            className={`${styles["Averages-tooltip"]} ${styles["Averages-tooltip_you"]}`}
          >
            You
          </div>
        </div>

        <div
          className={styles["Averages-meter-compare"]}
          style={{ width: `${(avgAmericanFlights * 100) / avgAmerican}%` }}
        >
          <div
            className={`${styles["Averages-tooltip"]} ${styles["Averages-tooltip_flip"]}`}
          >
            Per Capita Flights (0.58t)
          </div>
        </div>

        <div
          className={styles["Averages-meter-compare"]}
          style={{ width: "100%" }}
        >
          <div className={styles["Averages-tooltip"]}>
            Per Capita Total ({avgAmerican}t)
          </div>
        </div>
      </div>
      <Explainer />
    </figure>
  );
};

export default Averages;
