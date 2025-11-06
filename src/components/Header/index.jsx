"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Image
            src="/image/logo.png"
            alt="Logo do MarketCal"
            width={215}
            height={215}
            className={styles.logoImg}
            priority
          />
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>
                Influencers
              </Link>
            </li>
          </ul>
        </nav>
        
      </div>
    </header>
  );
}
