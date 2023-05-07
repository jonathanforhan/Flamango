import { Component, onMount, Setter } from "solid-js";

import { DOMNode, Props } from "../App";
import MathEngine, { MathJSON } from "./MathEngine";
import MathField from "./MathField";

declare var mathVirtualKeyboard: { layouts: string[] };

type MathInputProps = Props & {
  setInput: Setter<MathJSON>;
  mathEngine: MathEngine;
};

/**
 * MathInput, read-write, input listener sets input state
 */
const MathInput: Component<MathInputProps> = (props) => {
  let ref: DOMNode = undefined as unknown as HTMLDivElement;

  // Initialize keyboard
  onMount(() => {
    mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"];

    ref?.addEventListener("input", () => {
      if (!ref.value) return props.setInput(null);
      const data = props.mathEngine.parse(ref.value, { canonical: false });
      if (!data.errors.length) props.setInput(data.json as MathJSON);
    });
  });

  return <MathField class={props.class} ref={ref} style={props.style} />;
};

export default MathInput;
