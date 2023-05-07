import { Component, For } from "solid-js";
import { LaTeX } from "./MathEngine";
import styles from "./Math.module.css";

export type MathDisplayProps = {
  class?: string;
  width?: string;
  fontSize?: string;
  items: LaTeX[];
};

/**
 * MathDisplay using read-only math-field from mathlive
 */
const MathDisplay: Component<MathDisplayProps> = (props) => {
  return (
    <For each={props.items}>
      {(x) => {
        return (
          <div class={props.class}>
            <math-field
              class={styles.MathField}
              style={{
                width: props.width || "20em",
                fontSize: props.fontSize || "1.5em",
              }}
              read-only={true}
            >
              {x}
            </math-field>
          </div>
        );
      }}
    </For>
  );
};

export default MathDisplay;
