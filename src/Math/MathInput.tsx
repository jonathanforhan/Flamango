import {
  Accessor,
  Component,
  createEffect,
  createSignal,
  Setter,
} from "solid-js";

import { ComputeEngine } from "@cortex-js/compute-engine";

declare module "solid-js" {
  namespace JSX {
    export interface IntrinsicElements {
      ["math-field"]: any;
    }
  }
}

export type MathInputProps = {
  children?: Node;
  setExpr: Setter<string>;
};

export type MathNode = HTMLDivElement & { value?: string };

const MathInput: Component<MathInputProps> = (props) => {
  const [mathJSON, setMathJSON] = createSignal(null);

  const ce = new ComputeEngine();
  let ref: MathNode = undefined as unknown as HTMLDivElement;

  createEffect(() => {
    mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"];

    ref?.addEventListener("input", () => {
      if (ref.value) {
        const data = ce.parse(ref.value, { canonical: false });
        props.setExpr(ce.box(data.json).latex);
      } else {
        props.setExpr("");
      }
    });
  });

  return (
    <math-field ref={ref} style={{ width: "20em", fontSize: "1.5em" }}>
      {props.children}
    </math-field>
  );
};

export default MathInput;
