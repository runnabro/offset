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
        <p className={styles["Explainer-text"]}>
          The distance between two points is calculated with the{" "}
          <a
            href="//en.wikipedia.org/wiki/Haversine_formula"
            rel="noopener"
            target="_blank"
          >
            Haversine formula
          </a>
          . Short-haul flights (&#60;288 miles) at 0.000416738 tons of carbon
          per mile; and long-haul 0.0002863302 per mile. Assumes all flights are
          round trip and in economy.
        </p>
      )}
    </aside>
  );
};

export default Explainer;
