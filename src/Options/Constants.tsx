import { Component, createSignal, Setter } from "solid-js";
import styles from "./Options.module.css";

import { Props } from "../App";

import MathEngine, { MathJSON } from "../Math/MathEngine";
import MathInput from "../Math/MathInput";
import MathDisplay from "../Math/MathDisplay";
import { Minus, Plus } from "../Components/Icons";

type ConstantsProps = Props & {
  setConstants: Setter<{}>;
  onClick?: any;
};

/**
 * Constants, declare global constants
 */
export const Constants: Component<ConstantsProps> = (props) => {
  const [mathJSON, setMathJSON] = createSignal(null as MathJSON);
  const [clear, setClear] = createSignal("");
  const mathEngine = new MathEngine();

  const handleConstants = (json: MathJSON) => {
    if (json == null || !(json instanceof Array)) return;
    if (json[0] !== "Equal" || json[1] instanceof Array) return;
    if (JSON.stringify(json[2]).includes("Error")) return;
    props.setConstants((x) => ({ ...x, [json[1] as string]: json[2] }));
  };

  return (
    <div style={{ display: "flex" }}>
      <MathInput
        class={props.class}
        setInput={setMathJSON}
        mathEngine={mathEngine}
      >
        {props.children}
      </MathInput>
      <button
        class={styles.AddSubButton}
        onClick={() => {
          handleConstants(mathJSON());
          if (props.onClick) props.onClick();
        }}
      >
        <Plus />
      </button>
    </div>
  );
};

export const ConstantsDisplay: Component<Props & { onClick: any }> = (
  props
) => {
  return (
    <div style={{ display: "flex" }}>
      <MathDisplay class={props.class}>{props.children}</MathDisplay>
      <button class={styles.AddSubButton} onClick={props.onClick}>
        <Minus />
      </button>
    </div>
  );
};

export const ConstantsDefault: Component<Props> = (props) => {
  return <MathDisplay class={props.class}>{props.children}</MathDisplay>;
};
