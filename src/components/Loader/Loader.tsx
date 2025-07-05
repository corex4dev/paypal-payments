import React from "react";
import styles from "./Loader.module.css";

const Loader = ({ size = "md" }: { size?: "md" | "sm" }) => {
  return <span className={`${styles.loader} ${styles[size]}`} />;
};

export default Loader;
