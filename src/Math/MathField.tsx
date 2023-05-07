import { Component } from "solid-js";

import { Props } from "../App";

declare module "solid-js" {
  namespace JSX {
    export interface IntrinsicElements {
      ["math-field"]: any;
    }
  }
}

type MathFieldProps = Props & {
  readOnly?: boolean;
};

/**
 * Solid-js wrapper on math-field
 */
const MathField: Component<MathFieldProps> = (props) => {
  return (
    <math-field
      class={props.class}
      ref={props.ref}
      style={props.style}
      read-only={props.readOnly || false}
    >
      {props.children}
    </math-field>
  );
};

export default MathField;
