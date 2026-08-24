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
  permissions: string[];
  hasSubmenu?: boolean;
}

interface NavCategory {
  title: string;
  permissions: string[];
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'Main',
    permissions: [], // empty means all authenticated users can see it
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <IconDashboard />, permissions: [] }
    ]
  },
  {
    title: 'Property Management',
    permissions: ['view_projects', 'manage_projects'],
    items: [
      { id: 'projects', label: 'Projects', href: '/admin/projects', icon: <IconProjects />, permissions: ['view_projects', 'manage_projects'], hasSubmenu: true },
      { id: 'units', label: 'Units', href: '/admin/properties', icon: <IconUnits />, permissions: ['view_projects', 'manage_projects'] },
      { id: 'construction', label: 'Construction', href: '/admin/construction', icon: <IconConstruction />, permissions: ['manage_projects'] },
    ]
  },
  {
    title: 'Sales & CRM',
    permissions: ['view_leads', 'manage_leads', 'view_bookings', 'manage_bookings'],
    items: [
      { id: 'crm', label: 'CRM (Leads)', href: '/admin/leads', icon: <IconCRM />, permissions: ['view_leads', 'manage_leads'] },
      { id: 'bookings', label: 'Bookings', href: '/admin/bookings', icon: <IconBookings />, permissions: ['view_bookings', 'manage_bookings'] },
      { id: 'sales', label: 'Sales', href: '/admin/sales', icon: <IconSales />, permissions: ['manage_bookings'] },
    ]
  },
  {
    title: 'Contacts & Partners',
    permissions: ['manage_customers', 'manage_agencies'], 
    items: [
      { id: 'customers', label: 'Customers', href: '/admin/customers', icon: <IconUser />, permissions: ['manage_customers'] },
      { id: 'agencies', label: 'Marketing Agencies', href: '/admin/agencies', icon: <IconUsersGroup />, permissions: ['manage_agencies'] },
    ]
  },
  {
    title: 'System & Content',
    permissions: ['manage_users', 'manage_roles'],
    items: [
      { id: 'media', label: 'Media / Content', href: '/admin/content', icon: <IconMedia />, permissions: ['manage_projects'] }, // Adjust as needed
      { id: 'reports', label: 'Reports', href: '/admin/reports', icon: <IconReports />, permissions: ['view_projects'] },
      { id: 'users', label: 'User Management', href: '/admin/users', icon: <IconUsersGroup />, permissions: ['manage_users', 'manage_roles'], hasSubmenu: true },
    ]
  }
];

export const AdminSidebar: React.FC<{ userRole: Role | null | undefined; isOpen: boolean; projects?: Project[] }> = ({ userRole, isOpen, projects = [] }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    projects: pathname.startsWith('/admin/projects'),
    users: pathname.startsWith('/admin/users')
  });

  const userPermissions = userRole?.permissions || [];
  const hasPermission = (requiredPerms: string[]) => {
    if (requiredPerms.length === 0) return true; // Empty means no specific permission needed
    // Assuming Super Admin has all permissions, but the userPermissions list should be exhaustive from DB
    return requiredPerms.some(p => userPermissions.includes(p));
  };

  // Filter categories that have at least one allowed item for this role
  const allowedCategories = NAV_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item => hasPermission(item.permissions))
  })).filter(category => category.items.length > 0);

  const toggleSubmenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the parent href so it just toggles the menu
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

                  {item.hasSubmenu && item.id === 'users' && isSubmenuOpen && (
                    <div className={styles.submenu}>
                      {hasPermission(['manage_users']) && (
                        <Link 
                          href="/admin/users?refresh=1"
                          className={`${styles.submenuItem} ${pathname === '/admin/users' ? styles.active : ''}`}
                        >
                          Users
                        </Link>
                      )}
                      {hasPermission(['manage_roles']) && (
                        <Link 
                          href="/admin/users/roles?refresh=1"
                          className={`${styles.submenuItem} ${pathname.startsWith('/admin/users/roles') ? styles.active : ''}`}
                        >
                          Roles & Permissions
                        </Link>
                      )}
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
