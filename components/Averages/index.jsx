import { useEffect, useState } from "react";

import styles from "./style.module.scss";

const Averages = ({ carbonTotal }) => {
  // in metrics tons
  // https://ourworldindata.org/carbon-footprint-flying
  const avgAmericanFlights = 0.58354;
  const avgAmerican = 17.48;
  const [you, setYou] = useState(0);

  useEffect(() => {
    setYou(`${(carbonTotal * 100) / avgAmerican}%`);
  }, [carbonTotal]);

  return (
    <figure className={styles.Averages}>
      <figcaption className={styles["Averages-title"]}>You vs. USA</figcaption>
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
            Flights Avg. (0.58t)
          </div>
        </div>

        <div
          className={styles["Averages-meter-compare"]}
          style={{ width: "100%" }}
        >
          <div className={styles["Averages-tooltip"]}>Total Avg. (17.48t)</div>
        </div>
      </div>
    </figure>
  );
};

export default Averages;
