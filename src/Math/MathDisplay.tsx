import { Accessor, Component, createEffect, createSignal } from "solid-js";

declare module "solid-js" {
  namespace JSX {
    export interface IntrinsicElements {
      ["math-field"]: any;
    }
  }
}

export type MathDisplayProps = {
  value: Accessor<string>;
};

export type MathDisplayNode = HTMLDivElement & { value?: string };

const MathDisplay: Component<MathDisplayProps> = (props) => {
  const [output, setOutput] = createSignal(<></>);

  createEffect(() => {
    props.value();
    setOutput(
      <>
        <math-field
          style={{ width: "20em", fontSize: "1.5em" }}
          read-only={true}
        >
          {props.value}
        </math-field>
      </>
    );
  });

  return <>{output()}</>;
};

export default MathDisplay;
