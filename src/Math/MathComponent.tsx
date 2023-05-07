import { Component, createSignal, createEffect, For, Accessor } from "solid-js";
import styles from "./Math.module.css";

import { MathJSON } from "./MathEngine";
import { BoxedExpression } from "@cortex-js/compute-engine";
import { Props } from "../App";
import MathInput from "./MathInput";
import MathEngine from "./MathEngine";
import MathSetVariable from "./MathSetVariable";
import MathDisplay from "./MathDisplay";

const exclude = ["ExponentialE", "Pi"];

type MathComponentProps = Props & {
  rounding: Accessor<number>;
  scientific: Accessor<boolean>;
  constants?: Accessor<{}>;
};

/**
 * MathComponent, high-level wrapper on the input and display components to
 * create one math block for piping input in and out
 */
const MathComponent: Component<MathComponentProps> = (props) => {
  const [input, setInput] = createSignal(null as MathJSON);
  const [output, setOutput] = createSignal([] as BoxedExpression[]);
  const [variables, setVariables] = createSignal({});

  // Universal mathEngine passed to children to save on memory
  const mathEngine = new MathEngine();

  createEffect(() => setOutput(mathEngine.createEquations(input())));

  /**
   * Isolate LHS vars for VariableInput display
   */
  const isolateVariables = (expr: BoxedExpression[]) => {
    return expr
      .map((x) => (x.json as string[])[1] || "")
      .filter((x) => !exclude.includes(x));
  };

  return (
    <div class={styles.MathComponent}>
      <MathInput
        class={styles.MathInput}
        setInput={setInput}
        mathEngine={mathEngine}
      />
      <For each={isolateVariables(output())}>
        {(x) => (
          <MathSetVariable
            class={styles.MathSetVariable}
            setVariables={setVariables}
            mathEngine={mathEngine}
          >
            {x}
          </MathSetVariable>
        )}
      </For>
      <For
        each={mathEngine.format(
          output(),
          variables(),
          exclude,
          props.rounding(),
          false
        )}
      >
        {(x) => <MathDisplay class={styles.MathDisplay}>{x}</MathDisplay>}
      </For>
    </div>
  );
};

export default MathComponent;
