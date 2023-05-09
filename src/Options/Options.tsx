import {
  Component,
  createEffect,
  createSignal,
  For,
  onMount,
  Setter,
} from "solid-js";
import styles from "./Options.module.css";

import { Props } from "../App";

import { Wrench, Pi } from "../Components/Icons";
import { Dropdown, DropdownMenu } from "../Components/Dropdown";

import Config from "./Config";
import { Constants, ConstantsDefault } from "./Constants";

type OptionsProps = Props & {
  setRounding: Setter<number>;
  setScientific: Setter<boolean>;
  setConstants: Setter<{}>;
};

/**
 * Options Component for the various options including rounding,
 * scientific-notaiton, and setting global constants
 */
const Options: Component<OptionsProps> = (props) => {
  const [configActive, setConfigActive] = createSignal(false);
  const [constantActive, setConstantActive] = createSignal(false);
  const [constants, setConstantsLocal] = createSignal({});

  createEffect(() => {
    console.log(constants());
    props.setConstants(() => constants());
  });

  onMount(() => {
    document.addEventListener("click", (e: any) => {
      // very buggy virtual keyboard from math-live library handling
      const ML = e.target.classList[0]?.slice(0, 2) === "ML";
      const MLP = e.target.parentElement?.classList[0]?.slice(0, 2) === "ML";
      const clickedKB = ML || MLP || e.target.tagName === "path";

      if (!e.target.closest("[data-dropdown]") && !clickedKB) {
        setConfigActive(false);
        setConstantActive(false);
      }
    });
  });

  return (
    <div class={styles.Options}>
      <div />
      <div style={{ display: "grid" }}>
        <Dropdown>
          <button
            class={styles.Button}
            onClick={() => {
              setConfigActive(!configActive());
              setConstantActive(false);
            }}
          >
            <Wrench />
          </button>
          <DropdownMenu active={configActive}>
            <Config
              setRounding={props.setRounding}
              setScientific={props.setScientific}
            />
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <button
            class={styles.Button}
            onClick={() => {
              setConstantActive(!constantActive());
              setConfigActive(false);
            }}
          >
            <Pi />
          </button>
          <DropdownMenu active={constantActive}>
            <div style={{ padding: "0.8em", "text-align": "left" }}>
              Constants
            </div>
            <ConstantsDefault class={styles.Constants}>
              \pi=3.141593
            </ConstantsDefault>
            <ConstantsDefault class={styles.Constants}>
              e=2.718281
            </ConstantsDefault>
            <div style={{ "margin-bottom": "1em" }} />
            <Constants
              class={styles.Constants}
              setConstants={setConstantsLocal}
            />
            <div style={{ "margin-bottom": "1em" }} />
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Options;
