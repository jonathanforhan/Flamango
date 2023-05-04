import { Accessor, Component, For } from "solid-js";
import { LaTeX } from "./MathEngine";

declare module "solid-js" {
  namespace JSX {
    export interface IntrinsicElements {
      ["math-field"]: any;
    }
  }
}

export type MathDisplayProps = {
  class?: string;
  items: Accessor<LaTeX[]>;
};

export type MathDisplayNode = HTMLDivElement & { value?: string };

/**
 * MathDisplay using read-only math-field from mathlive
 */
const MathDisplay: Component<MathDisplayProps> = (props) => {
  return (
    <For each={props.items()}>
      {(x) => {
        return (
          <div class={props.class}>
            <math-field
              style={{ width: "20em", fontSize: "1.5em" }}
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
