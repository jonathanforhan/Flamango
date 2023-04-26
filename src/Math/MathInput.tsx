import { Component, createEffect, createSignal, Setter } from "solid-js";

import { ComputeEngine } from "@cortex-js/compute-engine";

declare module "solid-js" {
  namespace JSX {
    export interface IntrinsicElements {
      ["math-field"]: any;
    }
  }
}

declare var mathVirtualKeyboard: { layouts: string[] };

export type MathInputProps = {
  class?: string;
  children?: Node;
  setExpr: Setter<string[]>;
};

export type MathNode = HTMLDivElement & { value?: string };

/**
 * MathInput using math-field from mathlive
 */
const MathInput: Component<MathInputProps> = (props) => {
  const [mathJSON, setMathJSON] = createSignal(null);

  const ce = new ComputeEngine();
  let ref: MathNode = undefined as unknown as HTMLDivElement;

  createEffect(() => {
    mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"]; // eslint-disable

    ref?.addEventListener("input", () => {
      if (ref.value) {
        const data = ce.parse(ref.value, { canonical: false });
        props.setExpr([ce.box(data.json).latex, "\\frac{1}{2}", "1+2=3"]);
      } else {
        props.setExpr([]);
      }
    });
  });

  return (
    <div class={props.class}>
      <math-field ref={ref} style={{ width: "20em", fontSize: "1.5em" }}>
        {props.children}
      </math-field>
    </div>
  );
};

export default MathInput;
