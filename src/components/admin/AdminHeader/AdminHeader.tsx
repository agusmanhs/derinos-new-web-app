'use client';

import React from 'react';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle }) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuToggle} onClick={onMenuToggle}>
          ☰
        </button>
        {/* The title "Overview" is usually handled by the page content, not the global header */}
      </div>
      
      <div className={styles.right}>
        <div className={styles.searchBar}>
          <IconSearch />
          <input type="text" placeholder="Search properties, clients..." className={styles.searchInput} />
        </div>
        
        <button className={styles.iconBtn}>
          <IconBell />
          <span className={styles.badge}></span>
        </button>
      </div>
    </header>
  );
};
