import { For, Component, createEffect, createSignal } from "solid-js";
import styles from "./App.module.css";

import MathInput from "./Math/MathInput";
import MathDisplay from "./Math/MathDisplay";
import MathEngine, { MathJSON } from "./Math/MathEngine";
import MathVariableInput from "./Math/MathVariableInput";
import { BoxedExpression } from "@cortex-js/compute-engine";

const App: Component = () => {
  const [input, setInput] = createSignal(null as MathJSON);
  const [output, setOutput] = createSignal([] as BoxedExpression[]);
  const [constants, setConstants] = createSignal({});
  const mathEngine = new MathEngine();

  createEffect(() => setOutput(mathEngine.createEquations(input())));

  return (
    <>
      <div class={styles.App}>
        <div class={styles.AppWrapper}>
          <MathInput class={styles.Input} setInput={setInput} />
          <For each={output().map((x) => (x.json as string[])[1] || "")}>
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
            items={mathEngine.format(output(), constants(), 4, false)}
          />
        </div>
      </div>
    </>
  );
};

export default App;
