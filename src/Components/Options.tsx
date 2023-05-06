import { Component } from "solid-js";
import styles from "../App.module.css";

const Options: Component = () => {
  return (
    <>
      <nav class={styles.OptionsWrapper}>
        <div />
        <button onClick={() => alert("Button Clicked")}>
          <img src="src/assets/wrench.svg" height="25" width="25" />
        </button>
      </nav>
    </>
  );
};

export default Options;
