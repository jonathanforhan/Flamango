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

import { MathParser } from "./MathParser.tsx";

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
  // onChange?: (latex: string) => void;

  className?: string;
  children?: ReactNode;
};

export const Mathfield: React.FC<MathfieldProps> = (props) => {
  const mathfieldRef = useRef<MathfieldElement>(null);
  const [mathJSON, setMathJSON] = useState("");
  const mathParser = new MathParser();

  useEffect(() => {
    window.mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"];

    mathfieldRef.current?.addEventListener("input", () => {
      setMathJSON(
        JSON.stringify(mathParser.parse(mathfieldRef.current?.value).json)
      );
    });
  }, []);

  return (
    <>
      <math-field
        className={props.className}
        ref={mathfieldRef}
        style={{ width: "30em" }}
      >
        {props.children}
      </math-field>
      <div>{mathJSON}</div>
    </>
  );
};
