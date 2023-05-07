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
        <h4>Rounding</h4>
        <div class={styles.Slider}>
          <input
            type="range"
            min="0"
            max="5"
            value={round.toString()}
            onInput={(x) => handleRounding(Number(x.target.value))}
          />
          <div style={{ "text-align": "right" }}>
            <div>{1 / Math.pow(10, round())}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuration;
