import { Component, createSignal } from "solid-js";
import styles from "./App.module.css";

import MathInput from "./Math/MathInput";
import MathDisplay from "./Math/MathDisplay";

const App: Component = () => {
  const [expr, setExpr] = createSignal([]);

  return (
    <>
      <MathInput class={styles.App} setExpr={setExpr} />
      <MathDisplay class={styles.App} value={expr} />
    </>
  );
};

export default App;
