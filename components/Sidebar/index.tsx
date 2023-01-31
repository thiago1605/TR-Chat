import styles from "./styles.module.scss";
import React from "react";

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return <section className={styles.sidebar}>{children}</section>;
};
