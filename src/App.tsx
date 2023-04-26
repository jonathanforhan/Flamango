import { Component, createEffect, createSignal } from "solid-js";
import styles from "./App.module.css";

import MathInput from "./Math/MathInput";
import MathDisplay from "./Math/MathDisplay";

const App: Component = () => {
  const [expr, setExpr] = createSignal("Hello");

  return (
    <>
      <div class={styles.App}>
        <MathInput setExpr={setExpr} />
      </div>
      <div class={styles.App}>
        <MathDisplay value={expr} />
      </div>
    </>
  );
};

export default App;
