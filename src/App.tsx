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
            {(x) => {
              return (
                <MathVariableInput
                  class={styles.VariableInput}
                  item={x}
                  setConstant={setConstants}
                />
              );
            }}
          </For>
          <MathDisplay
            class={styles.Display}
            items={output()
              .map((x) => mathEngine.box(x).subs(constants()).simplify().json)
              .map((x) => {
                x = [x[0], x[1], mathEngine.box(x[2]).N().json];
                return mathEngine.box(x).simplify().latex.substring(0, 5);
              })
              .filter((x) => isNaN(Number(x[0])))}
          />
        </div>
      </div>
    </>
  );
};

export default App;
