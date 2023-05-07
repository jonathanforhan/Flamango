import { Setter, Component, createSignal, JSXElement } from "solid-js";
import styles from "./App.module.css";

import Nav from "./Components/Nav";
import Options from "./Components/Options";
import MathComponent from "./Math/MathComponent";

export type DOMNode = HTMLDivElement & { value?: string };

export type Props = {
  class?: string;
  ref?: DOMNode;
  style?: { [key: string]: string };
  children?: JSXElement;
};

export interface Options {
  setRounding: Setter<number>;
  setScientific: Setter<boolean>;
  setConstants: Setter<{}>;
}

const App: Component = () => {
  const [rounding, setRounding] = createSignal(5);
  const [scientific, setScientific] = createSignal(false);
  const [constants, setConstants] = createSignal({});

  return (
    <div class={styles.App}>
      <Nav class={styles.Nav} />
      <Options setRounding={setRounding} />
      <MathComponent rounding={rounding} scientific={scientific} />
    </div>
  );
};

export default App;
