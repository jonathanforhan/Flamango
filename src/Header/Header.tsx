import { Component } from "solid-js";
import styles from "./Header.module.css";

import Profile from "./Profile";

const Header: Component = () => {
  return (
    <nav class={styles.Header}>
      <div>Flamango</div>
      <Profile class={styles.Profile} />
    </nav>
  );
};

export default Header;
