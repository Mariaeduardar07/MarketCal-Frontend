import React from "react";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.containerLogin}>
      {/* ESQUERDA */}
      <div className={styles.left}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Bem vindo(a) ao MarketCal</h1>
          <p className={styles.text}>
            Sua estratégia de social media, organizada para performar
          </p>
        </div>
      </div>
    </div>
  );
}
