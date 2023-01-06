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
            aircraft with their respective flight distances and emissions:
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
                <td>Regional</td>
                <td>1322</td>
                <td>92</td>
              </tr>
            </tbody>
          </table>
          <small className={styles["Explainer-cite"]}>
            Carbon Footprint Flying,{" "}
            <a
              className={styles["Explainer-link"]}
              href="//ourworldindata.org/carbon-footprint-flying"
              rel="noopener"
              target="_blank"
            >
              ourworldindata.org
            </a>
            <br />
            CO₂ Commercial Aviation,{" "}
            <a
              className={styles["Explainer-link"]}
              href="//theicct.org/sites/default/files/publications/CO2-commercial-aviation-oct2020.pdf"
              rel="noopener"
              target="_blank"
            >
              theicct.org
            </a>
          </small>
        </>
      )}
    </aside>
  );
};

export default Explainer;
