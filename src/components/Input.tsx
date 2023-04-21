import React, { DOMAttributes, ReactNode, useEffect, useRef } from "react";
import {
  MathfieldElementAttributes,
  MathfieldElement,
  MathfieldOptions,
} from "mathlive";

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
  onChange?: (latex: string) => void;

  className?: string;
  children?: ReactNode;
};

export const Mathfield: React.FC<MathfieldProps> = (props) => {
  const mathfieldRef = useRef<MathfieldElement>(null);

  useEffect(() => {
    window.mathVirtualKeyboard.layouts = ["numeric", "alphabetic", "greek"];
    mathfieldRef.current?.addEventListener("input", () =>
      console.log(mathfieldRef.current?.value)
    );
  }, []);

  return (
    <math-field id="formula" className={props.className} ref={mathfieldRef}>
      {props.children}
    </math-field>
  );
};
