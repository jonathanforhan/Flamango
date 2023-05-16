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
