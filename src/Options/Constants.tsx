import { Component, createEffect, createSignal, Setter } from "solid-js";

import { Props } from "../App";

import MathEngine, { MathJSON } from "../Math/MathEngine";
import MathInput from "../Math/MathInput";
import MathDisplay from "../Math/MathDisplay";

type ConstantsProps = Props & {
  setConstants: Setter<{}>;
};

/**
 * Constants, declare global constants
 */
export const Constants: Component<ConstantsProps> = (props) => {
  const [mathJSON, setMathJSON] = createSignal(null as MathJSON);
  const mathEngine = new MathEngine();

  createEffect(() => {
    props.setConstants((x) => {
      return { ...x, [mathJSON()[1]]: mathJSON[2] };
    });
  });

  return (
    <MathInput
      class={props.class}
      setInput={setMathJSON}
      mathEngine={mathEngine}
    >
      {props.children}
    </MathInput>
  );
};

export const ConstantsDefault: Component<Props> = (props) => {
  return <MathDisplay class={props.class}>{props.children}</MathDisplay>;
};
