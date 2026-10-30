'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User, Role } from '@/types/auth';
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
  IconExternalLink,
  IconCockpit,
  IconFileLegal,
  IconWhatsApp
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
  badge?: string;
  badgeType?: 'live' | 'avail' | 'ok' | 'dot';
}

interface NavCategory {
  title: string;
  permissions: string[];
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'OPERASIONAL PROPERTI',
    permissions: [],
    items: [
      { id: 'cockpit', label: 'Executive Cockpit', href: '/admin', icon: <IconCockpit />, permissions: [], badge: 'LIVE', badgeType: 'live' },
      { id: 'units', label: 'Unit & Stok Kavling', href: '/admin/properties', icon: <IconUnits />, permissions: ['view_projects', 'manage_projects'], badge: '24 Avail', badgeType: 'avail' },
      { id: 'projects', label: 'Master Proyek & Site Plan', href: '/admin/projects', icon: <IconProjects />, permissions: ['view_projects', 'manage_projects'], hasSubmenu: true },
      { id: 'legal', label: 'Berkas KPR & Legalitas', href: '/admin/legal', icon: <IconFileLegal />, permissions: ['manage_bookings'], badge: 'KPR/SHM', badgeType: 'avail' },
      { id: 'construction', label: 'Progres Konstruksi', href: '/admin/construction', icon: <IconConstruction />, permissions: ['manage_projects', 'update_construction_progress', 'view_projects'] },
      { id: 'statuses', label: 'Master Status Kavling', href: '/admin/settings/statuses', icon: <IconSettings />, permissions: ['manage_projects'] },
    ]
  },
  {
    title: 'SALES & CRM',
    permissions: ['view_leads', 'manage_leads', 'view_bookings', 'manage_bookings', 'manage_customers', 'manage_agencies'],
    items: [
      { id: 'crm', label: 'Leads (CRM Prospek)', href: '/admin/leads', icon: <IconCRM />, permissions: ['view_leads', 'manage_leads'] },
      { id: 'bookings', label: 'Bookings & NUP', href: '/admin/bookings', icon: <IconBookings />, permissions: ['view_bookings', 'manage_bookings'] },
      { id: 'sales', label: 'Sales Deals & Akad', href: '/admin/sales', icon: <IconSales />, permissions: ['manage_bookings'] },
      { id: 'customers', label: 'Data Konsumen', href: '/admin/customers', icon: <IconUser />, permissions: ['manage_customers'] },
      { id: 'agencies', label: 'Marketing Agencies', href: '/admin/agencies', icon: <IconUsersGroup />, permissions: ['manage_agencies'] },
    ]
  },
  {
    title: 'INTEGRASI & SISTEM',
    permissions: ['manage_projects', 'manage_users', 'manage_roles'],
    items: [
      { id: 'landing', label: 'Landing Page Web', href: '/admin/landing', icon: <IconGlobe />, permissions: ['manage_projects'], hasSubmenu: true },
      { id: 'whatsapp', label: 'WA Blast & Automasi', href: '#wa-automation', icon: <IconWhatsApp />, permissions: [], badge: 'API OK', badgeType: 'ok' },
      { id: 'users', label: 'Pengaturan & Akses Tim', href: '/admin/users', icon: <IconSettings />, permissions: ['manage_users', 'manage_roles'], hasSubmenu: true },
    ]
  }
];

export const AdminSidebar: React.FC<{ 
  user?: User;
  userRole: Role | null | undefined; 
  isOpen: boolean; 
  projects?: Project[] 
}> = ({ user, userRole, isOpen, projects = [] }) => {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    projects: pathname.startsWith('/admin/projects'),
    users: pathname.startsWith('/admin/users'),
    landing: pathname.startsWith('/admin/landing')
  });

  const userPermissions = userRole?.permissions || [];
  const hasPermission = (requiredPerms: string[]) => {
    if (requiredPerms.length === 0) return true;
    return requiredPerms.some(p => userPermissions.includes(p));
  };

  const allowedCategories = NAV_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item => hasPermission(item.permissions))
  })).filter(category => category.items.length > 0);

  const toggleSubmenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenSubmenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentProjectName = projects.length > 0 ? projects[0].title : 'Cluster Alam Asri';

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Brand Header */}
      <div className={styles.logoContainer}>
        <div className={styles.logoRow}>
          <div className={styles.logoImgWrapper}>
            <Image 
              src="/logo.png" 
              alt="Derinos Logo" 
              width={36} 
              height={36} 
              className={styles.sidebarLogo} 
              priority
            />
          </div>
          <div className={styles.logoTextWrapper}>
            <div className={styles.brandTitle}>
              <span>DERINOS</span>
              <span className={styles.cmsBadge}>CMS</span>
              <span className={styles.versionBadge}>v4.2</span>
            </div>
            <div className={styles.logoSubtitle}>
              Executive Cockpit Suite
            </div>
          </div>
        </div>

        {/* Active Cluster Pill Indicator */}
        <div className={styles.clusterPill}>
          <span className={styles.clusterDot} />
          <span className={styles.clusterName}>{currentProjectName}</span>
          <span className={styles.clusterSold}>92% Terjual</span>
        </div>
      </div>

      {/* Nav Menu Categories */}
      <nav className={styles.nav}>
        {allowedCategories.map((category) => (
          <div key={category.title} className={styles.categorySection}>
            <div className={styles.categoryHeader}>{category.title}</div>
            
            {category.items.map((item) => {
              const isActive = (item.id === 'cockpit' && pathname === '/admin') || 
                               (item.id !== 'cockpit' && (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href) && !item.hasSubmenu)));
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
                    
                    {/* Badges matching mockup */}
                    {item.badge && (
                      <span className={`${styles.itemBadge} ${styles[item.badgeType || 'live']}`}>
                        {item.badge}
                      </span>
                    )}

                    {item.hasSubmenu && (
                      <span className={`${styles.chevron} ${isSubmenuOpen ? styles.chevronOpen : ''}`}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    )}
                  </Link>
                  
                  {item.hasSubmenu && item.id === 'projects' && isSubmenuOpen && (
                    <div className={styles.submenu}>
                      <Link 
                        href="/admin/projects"
                        className={`${styles.submenuItem} ${pathname === '/admin/projects' ? styles.activeSubmenu : ''}`}
                      >
                        Semua Proyek
                      </Link>
                      {projects.map(project => (
                        <Link 
                          key={project.id}
                          href={`/admin/projects/${project.slug}`}
                          className={`${styles.submenuItem} ${pathname === `/admin/projects/${project.slug}` ? styles.activeSubmenu : ''}`}
                        >
                          {project.title}
                        </Link>
                      ))}
                    </div>
                  )}

                  {item.hasSubmenu && item.id === 'users' && isSubmenuOpen && (
                    <div className={styles.submenu}>
                      {hasPermission(['manage_users']) && (
                        <Link 
                          href="/admin/users?refresh=1"
                          className={`${styles.submenuItem} ${pathname === '/admin/users' ? styles.activeSubmenu : ''}`}
                        >
                          Users & Tim
                        </Link>
                      )}
                      {hasPermission(['manage_roles']) && (
                        <Link 
                          href="/admin/users/roles?refresh=1"
                          className={`${styles.submenuItem} ${pathname.startsWith('/admin/users/roles') ? styles.activeSubmenu : ''}`}
                        >
                          Roles & Hak Akses
                        </Link>
                      )}
                    </div>
                  )}

                  {item.hasSubmenu && item.id === 'landing' && isSubmenuOpen && (
                    <div className={styles.submenu}>
                      <Link 
                        href="/admin/landing/general"
                        className={`${styles.submenuItem} ${pathname.includes('/landing/general') ? styles.activeSubmenu : ''}`}
                      >
                        Pengaturan Umum
                      </Link>
                      <Link 
                        href="/admin/landing/facilities"
                        className={`${styles.submenuItem} ${pathname.includes('/landing/facilities') ? styles.activeSubmenu : ''}`}
                      >
                        Fasilitas Kawasan
                      </Link>
                      <Link 
                        href="/admin/landing/gallery"
                        className={`${styles.submenuItem} ${pathname.includes('/landing/gallery') ? styles.activeSubmenu : ''}`}
                      >
                        Galeri Foto
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Profile Bar */}
      <div className={styles.bottomNav}>
        <Link 
          href="/" 
          target="_blank" 
          className={styles.liveWebLink}
          title="Buka Website Derinos di Tab Baru"
        >
          <span className={styles.liveWebIcon}><IconGlobe /></span>
          <span className={styles.liveWebLabel}>Pratinjau Web Publik</span>
          <span style={{ opacity: 0.6 }}><IconExternalLink /></span>
        </Link>

        <div className={styles.userProfileRow}>
          <div className={styles.userAvatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || 'Raden Ayu'}</div>
            <div className={styles.userRole}>{user?.role?.name || 'Lead Sales Admin'}</div>
          </div>
          <button 
            type="button"
            onClick={() => logoutAction()}
            className={styles.logoutBtn}
            title="Keluar / Sign Out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
