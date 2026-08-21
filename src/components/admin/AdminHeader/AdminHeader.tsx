'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './AdminHeader.module.css';
import { User } from '@/types/auth';
import { logoutAction } from '@/actions/authActions';

interface AdminHeaderProps {
  user: User;
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

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuToggle} onClick={onMenuToggle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className={styles.right}>
        <div className={styles.searchBar}>
          <IconSearch />
          <input type="text" placeholder="Search properties, clients, reports..." className={styles.searchInput} />
        </div>
        
        <button className={styles.iconBtn}>
          <IconBell />
          <span className={styles.badge}></span>
        </button>

        <div className={styles.userMenu} ref={dropdownRef}>
          <button 
            className={styles.userButton} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>
              <IconUser />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name || user.email}</span>
              <span className={styles.userRole}>{user.role.replace('_', ' ')}</span>
            </div>
            <svg className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <strong>{user.name || user.email}</strong>
                <span>{user.email}</span>
              </div>
              <div className={styles.dropdownDivider}></div>
              <Link href="/admin/settings" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                Profile Settings
              </Link>
              <div className={styles.dropdownDivider}></div>
              <button 
                className={`${styles.dropdownItem} ${styles.dangerItem}`} 
                onClick={() => {
                  setIsDropdownOpen(false);
                  logoutAction();
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
