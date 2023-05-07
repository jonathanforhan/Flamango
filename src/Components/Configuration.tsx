import { Component, createSignal, Setter } from "solid-js";
import styles from "./Components.module.css";

type ConfigurationProps = {
  setRounding: Setter<number>;
};

const Configuration: Component<ConfigurationProps> = (props) => {
  const [round, setRoundingLocal] = createSignal(5);
  const handleRounding = (r: number) => {
    setRoundingLocal(r);
    props.setRounding(r);
  };

  return (
    <>
      <div class={styles.Configuration}>
        <div style={{ padding: "0.8em 1em 0.8em 1.2em", "text-align": "left" }}>
          Rounding
        </div>

        <div class={styles.Slider}>
          <input
            style={{ width: "60%" }}
            type="range"
            min="0"
            max="5"
            value={round().toString()}
            onInput={(x) => handleRounding(Number(x.target.value))}
          />
          <div style={{ "text-align": "right" }}>
            <div>{1 / Math.pow(10, round())}</div>
          </div>
        </div>
        <div class={styles.SciNot}>
          <label class={styles.Switch}>
            <input type="checkbox" />
            <span class={styles.SwitchInner}></span>
          </label>
          <div style={{ "margin-left": "0.8em" }}>Scientific Notation</div>
        </div>
      </div>
    </>
  );
};

export default Configuration;
