/*
Copyright (C) 2023  Jonathan Forhan

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

import { Component, createSignal, JSXElement } from "solid-js";
import styles from "./App.module.css";

import Header from "./Header/Header";
import Options from "./Options/Options";
import MathComponent from "./Math/MathComponent";
import MathEngine from "./Math/MathEngine";

export type DOMNode = HTMLDivElement & { value?: string };

export type Props = {
  class?: string;
  ref?: DOMNode;
  style?: { [key: string]: string };
  children?: JSXElement;
};

const App: Component = () => {
  const [rounding, setRounding] = createSignal(5);
  const [scientific, setScientific] = createSignal(false);
  const [constants, setConstants] = createSignal({});

  // Universal mathEngine passed to children to save on memory
  const mathEngine = new MathEngine();

  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    return (
      <div style={{ padding: "1em", position: "absolute", top: "40%" }}>
        Flamango does not support mobile, please view on desktop
      </div>
    );
  }

  return (
    <div class={styles.App}>
      <Header />
      <Options
        setRounding={setRounding}
        setScientific={setScientific}
        setConstants={setConstants}
        mathEngine={mathEngine}
      />
      <MathComponent
        rounding={rounding}
        scientific={scientific}
        constants={constants}
        mathEngine={mathEngine}
      />
    </div>
  );
};

export default App;
