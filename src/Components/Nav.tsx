import { Component } from "solid-js";
import styles from "../App.module.css";

const Nav: Component = () => {
  return (
    <>
      <nav class={styles.Nav}>
        <div>Flamango</div>
        <ul>
          <a href="https://github.com/jonathanforhan/" class="Profile">
            <span class="">Profile</span>
          </a>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
