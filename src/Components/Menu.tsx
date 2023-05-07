import { Component, JSXElement } from "solid-js";

export type MenuProps = {
  class?: string;
  children?: JSXElement;
};

const Menu: Component<MenuProps> = (props) => {
  return <div class={props.class}>{props.children}</div>;
};

export default Menu;
