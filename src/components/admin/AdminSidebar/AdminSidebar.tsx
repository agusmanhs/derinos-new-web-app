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

interface NavCategory {
  title: string;
  roles: Role[];
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'Main',
    roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER', 'SALES_AGENT', 'CONTENT_MANAGER'],
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <IconDashboard />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER', 'SALES_AGENT', 'CONTENT_MANAGER'] }
    ]
  },
  {
    title: 'Property Management',
    roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'],
    items: [
      { id: 'projects', label: 'Projects', href: '/admin/projects', icon: <IconProjects />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'], hasSubmenu: true },
      { id: 'units', label: 'Units', href: '/admin/properties', icon: <IconUnits />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'] },
      { id: 'construction', label: 'Construction', href: '/admin/construction', icon: <IconConstruction />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'] },
    ]
  },
  {
    title: 'Sales & CRM',
    roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'],
    items: [
      { id: 'crm', label: 'CRM (Leads)', href: '/admin/leads', icon: <IconCRM />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'] },
      { id: 'bookings', label: 'Bookings', href: '/admin/bookings', icon: <IconBookings />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
      { id: 'sales', label: 'Sales', href: '/admin/sales', icon: <IconSales />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
    ]
  },
  {
    title: 'Contacts & Partners',
    roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'],
    items: [
      { id: 'customers', label: 'Customers', href: '/admin/customers', icon: <IconUser />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER', 'SALES_AGENT'] },
      { id: 'agencies', label: 'Marketing Agencies', href: '/admin/agencies', icon: <IconUsersGroup />, roles: ['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'] },
    ]
  },
  {
    title: 'System & Content',
    roles: ['SUPER_ADMIN', 'MANAGEMENT', 'CONTENT_MANAGER'],
    items: [
      { id: 'media', label: 'Media / Content', href: '/admin/content', icon: <IconMedia />, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
      { id: 'reports', label: 'Reports', href: '/admin/reports', icon: <IconReports />, roles: ['SUPER_ADMIN', 'MANAGEMENT'] },
      { id: 'users', label: 'Users Management', href: '/admin/users', icon: <IconUsersGroup />, roles: ['SUPER_ADMIN'] },
    ]
  }
];

export const AdminSidebar: React.FC<{ userRole: Role; isOpen: boolean; projects?: Project[] }> = ({ userRole, isOpen, projects = [] }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    projects: pathname.startsWith('/admin/projects')
  });

  // Filter categories that have at least one allowed item for this role
  const allowedCategories = NAV_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item => item.roles.includes(userRole))
  })).filter(category => category.items.length > 0);

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
      


      <nav className={styles.nav}>
        {allowedCategories.map((category) => (
          <div key={category.title}>
            {category.title !== 'Main' && (
              <div className={styles.categoryHeader}>{category.title}</div>
            )}
            {category.items.map((item) => {
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
          </div>
        ))}
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
        

      </div>
    </aside>
  );
};
