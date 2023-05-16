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

import { Component, createSignal, onMount, Setter } from "solid-js";
import styles from "./Options.module.css";

type ConfigProps = {
  setRounding: Setter<number>;
  setScientific: Setter<boolean>;
};

/**
 * Configuration options for the MathComponent, Round & ScientificNotation
 */
const Config: Component<ConfigProps> = (props) => {
  const [rounding, setRoundingLocal] = createSignal(NaN);
  const handleRounding = (r: number) => {
    setRoundingLocal(r);
    props.setRounding(r);
  };

  // gets the rounding specified in App.tsx without needing to pass accessor
  onMount(() => {
    props.setRounding((x) => {
      setRoundingLocal(x);
      return x;
    });
  });

  return (
    <>
      <div style={{ padding: "0.8em 1em 0.8em 1.2em", "text-align": "left" }}>
        Rounding
      </div>
      <div class={styles.Slider}>
        <input
          style={{ width: "60%" }}
          type="range"
          min="0"
          max="6"
          value={rounding()}
          onInput={(x: any) => handleRounding(+x.target.value)}
        />
        <div style={{ "text-align": "right" }}>
          {1 / Math.pow(10, rounding())}
        </div>
      </div>
      <div class={styles.Scientific}>
        <input
          type="checkbox"
          onChange={(e: any) => props.setScientific(e.target.checked)}
        />
        <div style={{ "margin-left": "0.8em" }}>Scientific Notation</div>
      </div>
    </>
  );
};

export default Config;
