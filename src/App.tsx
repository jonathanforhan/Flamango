import { Component, createSignal, JSXElement } from "solid-js";
import styles from "./App.module.css";

import Header from "./Header/Header";
import Options from "./Options/Options";
import MathComponent from "./Math/MathComponent";
import MathEngine from "./Math/MathEngine";

export type DOMNode = HTMLDivElement & { value?: string };

export type Props = {
  class?: string;
  ref?: DOMNode;
  style?: { [key: string]: string };
  children?: JSXElement;
};

const App: Component = () => {
  const [rounding, setRounding] = createSignal(5);
  const [scientific, setScientific] = createSignal(false);
  const [constants, setConstants] = createSignal({});

  // Universal mathEngine passed to children to save on memory
  const mathEngine = new MathEngine();

  return (
    <div class={styles.App}>
      <Header />
      <Options
        setRounding={setRounding}
        setScientific={setScientific}
        setConstants={setConstants}
        mathEngine={mathEngine}
      />
      <MathComponent
        rounding={rounding}
        scientific={scientific}
        constants={constants}
        mathEngine={mathEngine}
      />
    </div>
  );
};

export default App;
