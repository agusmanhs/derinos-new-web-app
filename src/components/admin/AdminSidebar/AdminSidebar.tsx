'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  IconSettings,
  IconUser,
  IconBookings,
  IconUsersGroup,
  IconGlobe,
  IconExternalLink
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
    title: 'Overview',
    permissions: [],
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: <IconDashboard />, permissions: [] }
    ]
  },
  {
    title: 'Properties & Projects',
    permissions: ['view_projects', 'manage_projects'],
    items: [
      { id: 'projects', label: 'Projects', href: '/admin/projects', icon: <IconProjects />, permissions: ['view_projects', 'manage_projects'], hasSubmenu: true },
      { id: 'units', label: 'Units & Inventory', href: '/admin/properties', icon: <IconUnits />, permissions: ['view_projects', 'manage_projects'] },
      { id: 'construction', label: 'Construction Progress', href: '/admin/construction', icon: <IconConstruction />, permissions: ['manage_projects'] },
      { id: 'statuses', label: 'Unit Statuses', href: '/admin/settings/statuses', icon: <IconSettings />, permissions: ['manage_projects'] },
    ]
  },
  {
    title: 'Sales & CRM',
    permissions: ['view_leads', 'manage_leads', 'view_bookings', 'manage_bookings'],
    items: [
      { id: 'crm', label: 'Leads (CRM)', href: '/admin/leads', icon: <IconCRM />, permissions: ['view_leads', 'manage_leads'] },
      { id: 'bookings', label: 'Bookings', href: '/admin/bookings', icon: <IconBookings />, permissions: ['view_bookings', 'manage_bookings'] },
      { id: 'sales', label: 'Sales Deals', href: '/admin/sales', icon: <IconSales />, permissions: ['manage_bookings'] },
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
    title: 'Website & System',
    permissions: ['manage_projects', 'manage_users', 'manage_roles'],
    items: [
      { id: 'landing', label: 'Landing Page', href: '/admin/landing', icon: <IconGlobe />, permissions: ['manage_projects'], hasSubmenu: true },
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
        <div className={styles.logoWrapper}>
          <Image src="/logo.png" alt="Derinos Logo" width={32} height={32} className={styles.sidebarLogo} />
          <div className={styles.logo}>
            Derinos Admin
          </div>
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

                  {item.hasSubmenu && item.id === 'landing' && isSubmenuOpen && (
                    <div className={styles.submenu}>
                      <Link 
                        href="/admin/landing/general"
                        className={`${styles.submenuItem} ${pathname.includes('/landing/general') ? styles.active : ''}`}
                      >
                        General Settings
                      </Link>
                      <Link 
                        href="/admin/landing/facilities"
                        className={`${styles.submenuItem} ${pathname.includes('/landing/facilities') ? styles.active : ''}`}
                      >
                        Facilities
                      </Link>
                      <Link 
                        href="/admin/landing/gallery"
                        className={`${styles.submenuItem} ${pathname.includes('/landing/gallery') ? styles.active : ''}`}
                      >
                        Gallery
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.bottomNav}>
        <Link 
          href="/" 
          target="_blank" 
          className={styles.navItem}
          title="Open live website in new tab"
        >
          <span className={styles.icon}><IconGlobe /></span>
          <span className={styles.label}>Live Website</span>
          <span style={{ opacity: 0.6, display: 'flex', alignItems: 'center' }}>
            <IconExternalLink />
          </span>
        </Link>
        <button 
          type="button"
          onClick={() => logoutAction()}
          className={styles.navItem}
          style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <span className={styles.icon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span className={styles.label}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
