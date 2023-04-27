import { Component, createEffect, Setter } from "solid-js";
import MathEngine, { MathJSON } from "./MathEngine";

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
  setInput: Setter<MathJSON>;
};

export type MathNode = HTMLDivElement & { value?: string };

/**
 * MathInput using math-field from mathlive
 */
const MathInput: Component<MathInputProps> = (props) => {
  const mathEngine = new MathEngine();
  let ref: MathNode = undefined as unknown as HTMLDivElement;

  createEffect(() => {
    mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"];

    ref?.addEventListener("input", () => {
      if (!ref.value) {
        return props.setInput(null);
      }

      const data = mathEngine.parse(ref.value, { canonical: false });
      props.setInput(data.json as MathJSON);
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
