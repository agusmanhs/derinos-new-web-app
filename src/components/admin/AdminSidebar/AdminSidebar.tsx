'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/types/auth';
import { 
  IconDashboard, 
  IconProjects, 
  IconUnits, 
  IconConstruction, 
  IconCRM, 
  IconSales, 
  IconMedia, 
  IconReports,
  IconSettings,
  IconSupport,
  IconUser
} from '@/components/ui/Icon/AdminIcons';
import styles from './AdminSidebar.module.css';
import { logoutAction } from '@/actions/authActions';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <IconDashboard />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER', 'SALES_AGENT', 'CONTENT_MANAGER'] },
  { label: 'Projects', href: '/admin/projects', icon: <IconProjects />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'] },
  { label: 'Units', href: '/admin/properties', icon: <IconUnits />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'] },
  { label: 'Construction', href: '/admin/construction', icon: <IconConstruction />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'] },
  { label: 'CRM', href: '/admin/leads', icon: <IconCRM />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'] },
  { label: 'Sales', href: '/admin/sales', icon: <IconSales />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
  { label: 'Media', href: '/admin/content', icon: <IconMedia />, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Reports', href: '/admin/reports', icon: <IconReports />, roles: ['SUPER_ADMIN', 'MANAGEMENT'] },
];

export const AdminSidebar: React.FC<{ userRole: Role; isOpen: boolean }> = ({ userRole, isOpen }) => {
  const pathname = usePathname();

  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          Derinos Admin
        </div>
        <div className={styles.logoSubtitle}>
          Estate Management
        </div>
      </div>
      
      <div className={styles.newPropertyContainer}>
        <button className={styles.newPropertyBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Property
        </button>
      </div>

      <nav className={styles.nav}>
        {allowedItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottomNav}>
        <Link href="/admin/settings" className={styles.navItem}>
          <span className={styles.icon}><IconSettings /></span>
          Settings
        </Link>
        <Link href="/admin/support" className={styles.navItem}>
          <span className={styles.icon}><IconSupport /></span>
          Support
        </Link>
        
        <div className={styles.userProfile} onClick={() => logoutAction()}>
          <div className={styles.avatar}>
            <IconUser />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin User</span>
            <span className={styles.userRole}>Logout</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
