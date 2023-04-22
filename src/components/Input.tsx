import React, {
  DOMAttributes,
  ReactNode,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  MathfieldElementAttributes,
  MathfieldElement,
  MathfieldOptions,
} from "mathlive";

import { MathEngine, MathJSON } from "./MathParser.tsx";

type CustomMathfieldElement<T> = Partial<T & DOMAttributes<T>>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ["math-field"]: CustomMathfieldElement<MathfieldElementAttributes>;
    }
  }
}

export type MathfieldProps = {
  options?: Partial<MathfieldOptions>;
  value?: string;
  className?: string;
  children?: ReactNode;
};

export const Mathfield: React.FC<MathfieldProps> = (props) => {
  const mathfieldRef = useRef<MathfieldElement>(null);
  const [mathJSON, setMathJSON] = useState(null as MathJSON);
  const [equations, setEquations] = useState([] as MathJSON[]);

  const mathEngine = new MathEngine();

  useEffect(() => {
    window.mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"];

    mathfieldRef.current?.addEventListener("input", () => {
      const data = mathEngine.parse(mathfieldRef.current?.value);
      const head: string = data.head;
      const jsonData: MathJSON = data.json;

      mathfieldRef.current?.value === ""
        ? setMathJSON(null)
        : setMathJSON(jsonData);

      if (head === "Equal") {
        setEquations(mathEngine.generateEquations(jsonData as MathJSON[]));
      }
    });
  }, []); // eslint-disable-line

  return (
    <>
      <math-field
        className={props.className}
        ref={mathfieldRef}
        style={{ width: "20em", fontSize: "1.5em" }}
      >
        {props.children}
      </math-field>
      <div>{"."}</div>
      <div>{mathfieldRef.current?.value}</div>
      <div>{"."}</div>
      <div>{JSON.stringify(mathJSON)}</div>
      <div>{"."}</div>
      {(() => {
        let i = 0;
        return equations.map((eq) => {
          return <div key={i++}>{mathEngine.toLatex(eq)}</div>;
        });
      })()}
    </>
  );
};
