import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import styles from "./style.module.scss";

const Explainer = () => {
  const [explainerOpen, setExplainerOpen] = useState(true);
  return (
    <aside className={styles.Explainer}>
      <h2
        className={styles["Explainer-heading"]}
        onClick={() => setExplainerOpen(!explainerOpen)}
        tabIndex="0"
      >
        {!explainerOpen && (
          <ChevronRight className={styles["Explainer-chevron"]} size="12" />
        )}
        {explainerOpen && (
          <ChevronDown className={styles["Explainer-chevron"]} size="12" />
        )}
        The Math
      </h2>
      {explainerOpen && (
        <>
          <p className={styles["Explainer-text"]}>
            The distance between two points is calculated with the{" "}
            <a
              href="//en.wikipedia.org/wiki/Haversine_formula"
              rel="noopener"
              target="_blank"
            >
              Haversine formula
            </a>
            . Flights are organized into regional, narrowbody, and widebody
            aircraft with their respective flight distances and emissions.
            Footprint and load factors are taken into account based on fare
            class:
          </p>
          <table className={styles["Explainer-table"]}>
            <thead>
              <tr>
                <th>Aircraft</th>
                <th>Avg Distance (km)</th>
                <th>g CO₂/km</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Regional</td>
                <td>581</td>
                <td>158</td>
              </tr>
              <tr>
                <td>Narrowbody</td>
                <td>1317</td>
                <td>86</td>
              </tr>
              <tr>
                <td>Widebody</td>
                <td>4696</td>
                <td>92</td>
              </tr>
            </tbody>
          </table>
          <table className={styles["Explainer-table"]}>
            <thead>
              <tr>
                <th>Class</th>
                <th>Single-Aisle</th>
                <th>Widebody</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Economy</td>
                <td>0.82</td>
                <td>0.76</td>
              </tr>
              <tr>
                <td>Business</td>
                <td>2.07</td>
                <td>2.30</td>
              </tr>
              <tr>
                <td>First</td>
                <td>4.79</td>
                <td>6.89</td>
              </tr>
            </tbody>
          </table>
          <cite className={styles["Explainer-cite"]}>
            Our World in Data,{" "}
            <a
              className={styles["Explainer-link"]}
              href="//ourworldindata.org/carbon-footprint-flying"
              rel="noopener"
              target="_blank"
            >
              ourworldindata.org
            </a>
            <br />
            The International Council on Clean Transportation,{" "}
            <a
              className={styles["Explainer-link"]}
              href="//theicct.org/sites/default/files/publications/CO2-commercial-aviation-oct2020.pdf"
              rel="noopener"
              target="_blank"
            >
              theicct.org
            </a>
            <br />
            The World Bank,{" "}
            <a
              className={styles["Explainer-link"]}
              href="//documents1.worldbank.org/curated/en/141851468168853188/pdf/WPS6471.pdf"
              rel="noopener"
              target="_blank"
            >
              worldbank.org
            </a>
          </cite>
        </>
      )}
    </aside>
  );
};

export default Explainer;
