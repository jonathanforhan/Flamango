import { Component, createEffect, createSignal, Setter } from "solid-js";
import styles from "./Math.module.css";
import MathEngine, { LaTeX, MathJSON } from "./MathEngine";
import MathInput from "./MathInput";
import MathDisplay from "./MathDisplay";
import { Props } from "../App";

type MathVarInputProps = Props & {
  setVariables: Setter<{}>;
  mathEngine: MathEngine;
};

/**
 * MathVariableInput, appends to constants list. This is where user enters
 * known values
 */
const MathSetVariable: Component<MathVarInputProps> = (props) => {
  const [input, setInput] = createSignal(null as MathJSON);

  createEffect(() => {
    input()
      ? props.setVariables((x) => {
        return { ...x, [props.children as string]: input() };
      })
      : props.setVariables((x) => {
        return { ...x, [props.children as string]: props.children };
      });
  });

  return (
    <div class={props.class}>
      <MathDisplay
        class={styles.MathVariableDisplay}
        style={{ display: "flex" }}
      >
        {props.children + "="}
      </MathDisplay>
      <MathInput
        class={styles.MathVariableInput}
        setInput={setInput}
        mathEngine={props.mathEngine}
      />
    </div>
  );
};

export default MathSetVariable;
