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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M12 14h.01M16 14h.01M8 14h.01"></path>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
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
      {/* Left: Mobile Toggle & Cockpit Status Bar */}
      <div className={styles.left}>
        <button className={styles.menuToggle} onClick={onMenuToggle} title="Buka Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Project Selector Box */}
        <div className={styles.projectPill}>
          <div className={styles.projectIcon}>
            <IconBuilding />
          </div>
          <div className={styles.projectInfo}>
            <span className={styles.projectName}>Taman Harmoni Residence</span>
            <span className={styles.projectCluster}>Cluster Alam Asri</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {/* ERP Sync Badge */}
        <div className={styles.erpBadge}>
          <span className={styles.erpDot} />
          <span>ERP SYNC: <strong>AKTIF</strong> (2m ago)</span>
        </div>

        {/* SLA Pill */}
        <div className={styles.slaBadge}>
          <IconClock />
          <span>LIVE SLA: <strong>00:11:42</strong> / avg 15m</span>
        </div>
      </div>
      
      {/* Right: Search, Notifications, Primary Action & User */}
      <div className={styles.right}>
        {/* Global Search Bar */}
        <div className={styles.searchBar}>
          <IconSearch />
          <input 
            type="text" 
            placeholder="Cari Kavling, NIK, No. WA..." 
            className={styles.searchInput} 
          />
        </div>
        
        {/* Notification Bell */}
        <button className={styles.iconBtn} title="Notifikasi Sistem">
          <IconBell />
          <span className={styles.badge}></span>
        </button>

        {/* + Input Lead Baru CTA Button */}
        <Link href="/admin/leads?create=1" className={styles.primaryCta}>
          <IconPlus />
          <span>Input Lead Baru</span>
        </Link>

        {/* User Menu */}
        <div className={styles.userMenu} ref={dropdownRef}>
          <button 
            className={styles.userButton} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name || user.email}</span>
              <span className={styles.userRole}>{user.role?.name || 'Lead Sales Admin'}</span>
            </div>
            <svg className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              <Link href="/admin/users" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                Pengaturan Profil & Tim
              </Link>
              <Link href="/" target="_blank" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                Lihat Web Publik
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
