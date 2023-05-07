import { Accessor, Component } from "solid-js";
import styles from "./Components.module.css";

import { Props } from "../App";

/**
 * Dropdown wrapper, use [data-dropdown] to get data-selector
 */
export const Dropdown: Component<Props> = (props) => {
  return (
    <div data-dropdown class={styles.Dropdown}>
      {props.children}
    </div>
  );
};

export type DropdownMenuProps = Props & {
  active: Accessor<boolean>;
};

/**
 * DropdownMenu, wraps contents and appears only when 'active'
 */
export const DropdownMenu: Component<DropdownMenuProps> = (props) => {
  return (
    <div class={props.active() ? styles.DropMenuActive : styles.DropMenu}>
      {props.children}
    </div>
  );
};
