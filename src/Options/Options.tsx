import { Component, createSignal, onMount, Setter } from "solid-js";
import styles from "./Options.module.css";

import { Props } from "../App";

import { Wrench, Pi } from "../Components/Icons";
import { Dropdown, DropdownMenu } from "../Components/Dropdown";

import Config from "./Config";

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

  onMount(() => {
    document.addEventListener("click", (e: any) => {
      if (!e.target.closest("[data-dropdown]")) {
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
          <DropdownMenu active={constantActive}>CONSTANTS</DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Options;
