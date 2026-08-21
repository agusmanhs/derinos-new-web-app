'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/types/auth';
import { Project } from '@/types/project';
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
  IconUser,
  IconBookings,
  IconUsersGroup
} from '@/components/ui/Icon/AdminIcons';
import styles from './AdminSidebar.module.css';
import { logoutAction } from '@/actions/authActions';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  hasSubmenu?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <IconDashboard />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER', 'SALES_AGENT', 'CONTENT_MANAGER'] },
  { id: 'projects', label: 'Projects', href: '/admin/projects', icon: <IconProjects />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'], hasSubmenu: true },
  { id: 'units', label: 'Units', href: '/admin/properties', icon: <IconUnits />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'] },
  { id: 'construction', label: 'Construction', href: '/admin/construction', icon: <IconConstruction />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'] },
  { id: 'crm', label: 'CRM', href: '/admin/leads', icon: <IconCRM />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'] },
  { id: 'customers', label: 'Customers', href: '/admin/customers', icon: <IconUser />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'] },
  { id: 'agencies', label: 'Agencies', href: '/admin/agencies', icon: <IconUsersGroup />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
  { id: 'bookings', label: 'Bookings', href: '/admin/bookings', icon: <IconBookings />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
  { id: 'sales', label: 'Sales', href: '/admin/sales', icon: <IconSales />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
  { id: 'media', label: 'Media', href: '/admin/content', icon: <IconMedia />, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { id: 'users', label: 'Users', href: '/admin/users', icon: <IconUsersGroup />, roles: ['SUPER_ADMIN'] },
  { id: 'reports', label: 'Reports', href: '/admin/reports', icon: <IconReports />, roles: ['SUPER_ADMIN', 'MANAGEMENT'] },
];

export const AdminSidebar: React.FC<{ userRole: Role; isOpen: boolean; projects?: Project[] }> = ({ userRole, isOpen, projects = [] }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    projects: pathname.startsWith('/admin/projects')
  });

  const allowedItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  const toggleSubmenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubmenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href) && !item.hasSubmenu);
          const isSubmenuOpen = openSubmenus[item.id];
          
          return (
            <div key={item.id} className={styles.navItemContainer}>
              <Link 
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={(e) => item.hasSubmenu ? toggleSubmenu(item.id, e) : null}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
                
                {item.hasSubmenu && (
                  <span className={`${styles.chevron} ${isSubmenuOpen ? styles.chevronOpen : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                )}
              </Link>
              
              {item.hasSubmenu && item.id === 'projects' && isSubmenuOpen && (
                <div className={styles.submenu}>
                  <Link 
                    href="/admin/projects"
                    className={`${styles.submenuItem} ${pathname === '/admin/projects' ? styles.active : ''}`}
                  >
                    All Projects
                  </Link>
                  {projects.map(project => (
                    <Link 
                      key={project.id}
                      href={`/admin/projects/${project.slug}`}
                      className={`${styles.submenuItem} ${pathname === `/admin/projects/${project.slug}` ? styles.active : ''}`}
                    >
                      {project.slug}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
