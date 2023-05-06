import { For, Component, createEffect, createSignal } from "solid-js";
import styles from "./App.module.css";

import Nav from "./Components/Nav";
import Options from "./Components/Options";

import MathInput from "./Math/MathInput";
import MathDisplay from "./Math/MathDisplay";
import MathEngine, { MathJSON } from "./Math/MathEngine";
import MathVariableInput from "./Math/MathVariableInput";
import { BoxedExpression } from "@cortex-js/compute-engine";

const exclude = ["ExponentialE", "Pi"];
const round = 4;
const sci = false;

const App: Component = () => {
  const [input, setInput] = createSignal(null as MathJSON);
  const [output, setOutput] = createSignal([] as BoxedExpression[]);
  const [constants, setConstants] = createSignal({});

  const mathEngine = new MathEngine();

  createEffect(() => setOutput(mathEngine.createEquations(input())));

  return (
    <>
      <Nav />
      <Options />
      <div class={styles.App}>
        <div class={styles.AppWrapper}>
          <MathInput class={styles.Input} setInput={setInput} />
          <For
            each={output()
              .map((x) => (x.json as string[])[1] || "")
              .filter((x) => !exclude.includes(x))}
          >
            {(x) => (
              <MathVariableInput
                class={styles.VariableInput}
                item={x}
                setConstant={setConstants}
              />
            )}
          </For>
          <MathDisplay
            class={styles.Display}
            items={mathEngine.format(
              output(),
              constants(),
              exclude,
              round,
              sci
            )}
          />
        </div>
      </div>
    </>
  );
};

export default App;
