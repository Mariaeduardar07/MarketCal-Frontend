'use client';

import { useState } from 'react';
import styles from './header.module.css';

export default function Header() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className={styles.header}>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Search Box */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search Task"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
          />

        </div>

      <div className={styles.headerContent}>
        {/* Category Button */}
        <button className={styles.filterButton}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>Category</span>
        </button>

        {/* Sort By Button */}
        <button className={styles.filterButton}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          <span>Sort By: Deadline</span>
        </button>

        {/* Icons */}
        <button className={styles.iconButton}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <button className={styles.iconButton}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="2.5" fill="white" />
            <path d="M12 15c-2 0-3 1-3 2v2h6v-2c0-1-1-2-3-2" fill="white" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  );
}
