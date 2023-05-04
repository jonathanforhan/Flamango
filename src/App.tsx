import { Component, createEffect, createSignal } from "solid-js";
import styles from "./App.module.css";

import MathInput from "./Math/MathInput";
import MathDisplay from "./Math/MathDisplay";
import MathEngine, { LaTeX, MathJSON } from "./Math/MathEngine";

const App: Component = () => {
  const [input, setInput] = createSignal(null as MathJSON);
  const [output, setOutput] = createSignal([] as LaTeX[]);
  const mathEngine = new MathEngine();

  createEffect(() => {
    setOutput(mathEngine.createEquations(input()));
  });

  return (
    <>
      <MathInput class={styles.App} setInput={setInput} />
      <MathDisplay class={styles.App} items={output} />
    </>
  );
};

export default App;
