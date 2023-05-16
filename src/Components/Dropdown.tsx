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
