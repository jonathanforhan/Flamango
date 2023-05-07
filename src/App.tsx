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
const sci = false;

const App: Component = () => {
  const [input, setInput] = createSignal(null as MathJSON);
  const [output, setOutput] = createSignal([] as BoxedExpression[]);
  const [constants, setConstants] = createSignal({});
  const [rounding, setRounding] = createSignal(5);

  const mathEngine = new MathEngine();

  createEffect(() => setOutput(mathEngine.createEquations(input())));

  return (
    <>
      <div class={styles.App}>
        <Nav class={styles.Nav} />
        <Options setRounding={setRounding} />
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
              rounding(),
              sci
            )}
          />
        </div>
      </div>
    </>
  );
};

export default App;
