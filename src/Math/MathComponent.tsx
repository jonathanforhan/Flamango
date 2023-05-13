import { Component, createSignal, createEffect, For, Accessor } from "solid-js";
import styles from "./Math.module.css";

import { MathJSON } from "./MathEngine";
import { BoxedExpression } from "@cortex-js/compute-engine";

import MathInput from "./MathInput";
import MathEngine from "./MathEngine";
import MathSetVariable from "./MathSetVariable";
import MathDisplay from "./MathDisplay";

type MathComponentProps = {
  rounding: Accessor<number>;
  scientific: Accessor<boolean>;
  constants: Accessor<{}>;
  mathEngine: MathEngine;
};

const exclude = ["ExponentialE", "Pi", "Nothing"];

/**
 * MathComponent, high-level wrapper on the input and display components to
 * create one math block for piping input in and out
 */
const MathComponent: Component<MathComponentProps> = (props) => {
  const [input, setInput] = createSignal(null as MathJSON);
  const [output, setOutput] = createSignal([] as BoxedExpression[]);
  const [variables, setVariables] = createSignal({});

  const mathEngine = props.mathEngine;

  createEffect(() => setOutput(mathEngine.createEquations(input())));

  /**
   * Isolate LHS vars for VariableInput display
   */
  const isolateVariables = (expr: BoxedExpression[]) => {
    return expr
      .map((x) => (x.json as string[])[1] || "")
      .filter((x) => {
        // not in exclude list and not a constant value
        return (
          !exclude.includes(x) && !Object.keys(props.constants()).includes(x)
        );
      });
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
          { ...variables(), ...props.constants() },
          exclude,
          props.rounding(),
          props.scientific()
        )}
      >
        {(x) => <MathDisplay class={styles.MathDisplay}>{x}</MathDisplay>}
      </For>
    </div>
  );
};

export default MathComponent;
