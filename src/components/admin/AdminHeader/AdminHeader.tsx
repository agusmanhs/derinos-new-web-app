'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AdminHeader.module.css';
import { User } from '@/types/auth';
import { Project } from '@/types/project';
import { logoutAction } from '@/actions/authActions';

interface AdminHeaderProps {
  user: User;
  projects?: Project[];
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

export const AdminHeader: React.FC<AdminHeaderProps> = ({ user, projects = [], onMenuToggle }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.length > 0 ? projects[0] : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (projectRef.current && !projectRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/properties?search=${encodeURIComponent(searchQuery.trim())}`);
  };

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
        <div className={styles.projectWrapper} ref={projectRef}>
          <div 
            className={styles.projectPill}
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            title="Klik untuk memilih atau membuka proyek"
          >
            <div className={styles.projectIcon}>
              <IconBuilding />
            </div>
            <div className={styles.projectInfo}>
              <span className={styles.projectName}>
                {activeProject ? activeProject.title : 'Derinos Group'}
              </span>
              <span className={styles.projectCluster}>
                {activeProject ? activeProject.location : 'Master Proyek'}
              </span>
            </div>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ transform: isProjectDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {isProjectDropdownOpen && (
            <div className={styles.projectDropdown}>
              <div className={styles.projectDropdownHeader}>
                Daftar Proyek Derinos ({projects.length})
              </div>
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/admin/projects/${proj.id}`}
                    className={styles.projectDropdownItem}
                    onClick={() => setIsProjectDropdownOpen(false)}
                  >
                    <span className={styles.projectDropdownTitle}>{proj.title}</span>
                    <div className={styles.projectDropdownMeta}>
                      <span>{proj.location}</span>
                      <span style={{ fontWeight: 600, color: '#059669' }}>
                        {proj.availableUnits} unit tersedia
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#64748B' }}>
                  Belum ada proyek terdaftar.
                </div>
              )}
              <Link 
                href="/admin/projects"
                className={styles.projectDropdownItem}
                style={{ backgroundColor: '#F8FAFC', fontWeight: 600, color: '#D97706', textAlign: 'center', fontSize: '0.78rem' }}
                onClick={() => setIsProjectDropdownOpen(false)}
              >
                Lihat Semua Proyek & Site Plan →
              </Link>
            </div>
          )}
        </div>

        {/* ERP Sync Badge */}
        <div className={styles.erpBadge}>
          <span className={styles.erpDot} />
          <span>SISTEM: <strong>ONLINE</strong></span>
        </div>

        {/* SLA Pill */}
        <div className={styles.slaBadge}>
          <IconClock />
          <span>PORTFOLIO: <strong>{projects.length} Proyek Aktif</strong></span>
        </div>
      </div>
      
      {/* Right: Search, Notifications, Primary Action & User */}
      <div className={styles.right}>
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <IconSearch />
          <input 
            type="text" 
            placeholder="Cari Kavling, NIK, No. WA..." 
            className={styles.searchInput} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        {/* Notification Bell */}
        <Link href="/admin/leads" className={styles.iconBtn} title="Leads & Notifikasi Prospek">
          <IconBell />
          <span className={styles.badge}></span>
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
