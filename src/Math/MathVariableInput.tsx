import { Component, createEffect, createSignal, Setter } from "solid-js";
import styles from "./Math.module.css";
import { LaTeX, MathJSON } from "./MathEngine";
import MathInput from "./MathInput";
import MathDisplay from "./MathDisplay";

export type MathInputProps = {
  class?: string;
  width?: string;
  fontSize?: string;
  item: LaTeX;
  setConstant: Setter<{}>;
};

/**
 * MathInput using math-field from mathlive
 */
const MathVariableInput: Component<MathInputProps> = (props) => {
  const [input, setInput] = createSignal(null as MathJSON);

  createEffect(() => {
    input()
      ? props.setConstant((x) => {
          return { ...x, [props.item]: input() };
        })
      : props.setConstant((x) => {
          return { ...x, [props.item]: props.item };
        });
  });

  return (
    <div class={props.class}>
      <MathDisplay
        class={styles.VariableInputComponent}
        width={"2em"}
        fontSize={props.fontSize || "1.5em"}
        items={[props.item + "="]}
      />
      <MathInput
        class={styles.VariableInputComponent}
        width={props.width || "17.5em"}
        fontSize={props.fontSize || "1.5em"}
        setInput={setInput}
      />
    </div>
  );
};

export default MathVariableInput;
