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

import { Component, createEffect, createSignal, Setter } from "solid-js";
import styles from "./Math.module.css";

import MathEngine, { MathJSON } from "./MathEngine";
import MathInput from "./MathInput";
import MathDisplay from "./MathDisplay";
import { Props } from "../App";

type MathVarInputProps = Props & {
  setVariables: Setter<{}>;
  mathEngine: MathEngine;
};

/**
 * MathVariableInput, appends to constants list. This is where user enters
 * known values
 */
const MathSetVariable: Component<MathVarInputProps> = (props) => {
  const [input, setInput] = createSignal(null as MathJSON);

  createEffect(() => {
    input()
      ? props.setVariables((x) => {
        return { ...x, [props.children as string]: input() };
      })
      : props.setVariables((x) => {
        return { ...x, [props.children as string]: props.children };
      });
  });

  return (
    <div class={props.class}>
      <MathDisplay
        class={styles.MathVariableDisplay}
        style={{ display: "flex" }}
      >
        {props.children + "="}
      </MathDisplay>
      <MathInput
        class={styles.MathVariableInput}
        setInput={setInput}
        mathEngine={props.mathEngine}
      />
    </div>
  );
};

export default MathSetVariable;
