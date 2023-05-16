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
