import { Component } from "solid-js";

export type NavProps = {
  class?: string;
};

const Nav: Component<NavProps> = (props) => {
  return (
    <>
      <nav class={props.class}>
        <div>Flamango</div>
        <ul>
          <a href="https://github.com/jonathanforhan/">
            <span>Profile</span>
          </a>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
