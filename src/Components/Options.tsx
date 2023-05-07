import { Component, createSignal, onMount, Setter } from "solid-js";
import styles from "./Components.module.css";
import Configuration from "./Configuration";

import { Wrench, Pi } from "./Icons";
import Menu from "./Menu";

type OptionsProps = {
  setRounding: Setter<number>;
};

const Options: Component<OptionsProps> = (props) => {
  const [configBtn, setConfigBtn] = createSignal(false);
  const [constantBtn, setConstantBtn] = createSignal(false);

  onMount(() => {
    const closeMenus = (e: any) => {
      if (!e.target.closest("[data-dropdown]")) {
        setConfigBtn(false);
        setConstantBtn(false);
      }
    };
    document.addEventListener("click", closeMenus);
  });

  return (
    <nav class={styles.Options}>
      <div />
      <div style={{ display: "grid" }}>
        <div class={styles.Dropdown} data-dropdown>
          <button
            class={styles.Button}
            onClick={() => {
              setConfigBtn(!configBtn());
              setConstantBtn(false);
            }}
          >
            <Wrench />
          </button>
          <Menu class={configBtn() ? styles.DropMenuActive : styles.DropMenu}>
            <Configuration setRounding={props.setRounding} />
          </Menu>
        </div>
        <div class={styles.Dropdown} data-dropdown>
          <button
            class={styles.Button}
            onClick={() => {
              setConstantBtn(!constantBtn());
              setConfigBtn(false);
            }}
          >
            <Pi />
          </button>
          <Menu class={constantBtn() ? styles.DropMenuActive : styles.DropMenu}>
            <Configuration setRounding={props.setRounding} />
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default Options;
