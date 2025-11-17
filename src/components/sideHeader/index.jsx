"use client";

import Link from "next/link";
import Image from "next/image";
import styles from './sideHeader.module.css';

export default function SideHeader() {
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
        
        {/* Navegação Desktop */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
            <Link href="/dashboard" className={styles.navLink}>
            Dashboard
              </Link>
            </li>
            <li className={styles.navItem}>
            <Link href="/pageTask" className={styles.navLink}>
            Feed
              </Link>
            </li>
            <li className={styles.navItem}>
            <Link href="/pageExplore" className={styles.navLink}>
                Influencers
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}