'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/actions/authActions';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  onMenuToggle: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ userName, userRole, onMenuToggle }) => {
  const pathname = usePathname();
  
  // Very simple breadcrumb generation
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map(segment => 
    segment.charAt(0).toUpperCase() + segment.slice(1)
  ).join(' / ');

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuToggle} onClick={onMenuToggle}>
          ☰
        </button>
        <div className={styles.breadcrumbs}>
          {breadcrumbs}
        </div>
      </div>
      
      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{userName}</span>
          <span className={styles.userRole}>{userRole.replace('_', ' ')}</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};
