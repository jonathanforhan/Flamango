import { Component } from "solid-js";
import { Props } from "../App";

import MathField from "./MathField";

/**
 * MathDisplay using read-only math-field from mathlive
 */
const MathDisplay: Component<Props> = (props) => {
  return (
    <div style={props.style}>
      <MathField class={props.class} readOnly={true}>
        {props.children}
      </MathField>
    </div>
  );
};

export default MathDisplay;
