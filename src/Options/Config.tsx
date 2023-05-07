import { Component, createSignal, Setter } from "solid-js";
import styles from "./Options.module.css";

type ConfigProps = {
  setRounding: Setter<number>;
};

const Configuration: Component<ConfigProps> = (props) => {
  const [rounding, setRoundingLocal] = createSignal(5);
  const handleRounding = (r: number) => {
    setRoundingLocal(r);
    props.setRounding(r);
  };

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
          max="5"
          value={rounding().toString()}
          onInput={(x) => handleRounding(Number(x.target.value))}
        />
        <div style={{ "text-align": "right" }}>
          <div>{1 / Math.pow(10, rounding())}</div>
        </div>
      </div>
      <div class={styles.SciNot}>
        <label class={styles.Switch}>
          <input type="checkbox" />
          <span class={styles.SwitchInner}></span>
        </label>
        <div style={{ "margin-left": "0.8em" }}>Scientific Notation</div>
      </div>
    </>
  );
};

export default Configuration;
