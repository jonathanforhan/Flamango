import { Component, createSignal, onMount, Setter } from "solid-js";
import styles from "./Options.module.css";

type ConfigProps = {
  setRounding: Setter<number>;
  setScientific: Setter<boolean>;
};

/**
 * Configuration options for the MathComponent, Round & ScientificNotation
 */
const Config: Component<ConfigProps> = (props) => {
  const [rounding, setRoundingLocal] = createSignal(NaN);
  const handleRounding = (r: number) => {
    setRoundingLocal(r);
    props.setRounding(r);
  };

  // gets the rounding specified in App.tsx without needing to pass accessor
  onMount(() => {
    props.setRounding((x) => {
      setRoundingLocal(x);
      return x;
    });
  });

  return (
    <>
      <div style={{ padding: "0.8em 1em 0.8em 1.2em", "text-align": "left" }}>
        Rounding
      </div>
      <div class={styles.Slider}>
        <input
          style={{ width: "60%" }}
          type="range"
          min="0"
          max="6"
          value={rounding()}
          onInput={(x) => handleRounding(+x.target.value)}
        />
        <div style={{ "text-align": "right" }}>
          {1 / Math.pow(10, rounding())}
        </div>
      </div>
      <div class={styles.Scientific}>
        <input
          type="checkbox"
          onChange={(e) => props.setScientific(e.target.checked)}
        />
        <div style={{ "margin-left": "0.8em" }}>Scientific Notation</div>
      </div>
    </>
  );
};

export default Config;
