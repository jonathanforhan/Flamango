/*
    Copyright (C) 2023 Jonathan Forhan

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
      if (!data.errors.length) {
        props.setInput(data.json as MathJSON);
      }
    });
  });

  return (
    <MathField class={props.class} ref={ref} style={props.style}>
      {props.children}
    </MathField>
  );
};

export default MathInput;
