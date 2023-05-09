import { Component, createSignal, JSXElement } from "solid-js";
import styles from "./App.module.css";

import Header from "./Header/Header";
import Options from "./Options/Options";
import MathComponent from "./Math/MathComponent";

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

  return (
    <div class={styles.App}>
      <Header />
      <Options
        setRounding={setRounding}
        setScientific={setScientific}
        setConstants={setConstants}
      />
      <MathComponent
        rounding={rounding}
        scientific={scientific}
        constants={constants}
      />
    </div>
  );
};

export default App;
