'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/types/auth';
import styles from './AdminSidebar.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊', roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER', 'SALES_AGENT', 'CONTENT_MANAGER'] },
  { label: 'Leads', href: '/admin/leads', icon: '🎯', roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'] },
  { label: 'Projects', href: '/admin/projects', icon: '🏢', roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'] },
  { label: 'Properties', href: '/admin/properties', icon: '🏠', roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'] },
  { label: 'Content', href: '/admin/content', icon: '📝', roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { label: 'Users & Roles', href: '/admin/users', icon: '👥', roles: ['SUPER_ADMIN'] },
];

export const AdminSidebar: React.FC<{ userRole: Role; isOpen: boolean }> = ({ userRole, isOpen }) => {
  const pathname = usePathname();

  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        Derinos<span>Admin</span>
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

      <div className={styles.footer}>
        v1.0.0
      </div>
    </aside>
  );
};
