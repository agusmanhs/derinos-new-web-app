'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader/AdminHeader';
import { User } from '@/types/auth';
import styles from './layout.module.css';

interface Props {
  user: User;
  children: React.ReactNode;
}

export const AdminLayoutClient: React.FC<Props> = ({ user, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar userRole={user.role} isOpen={isSidebarOpen} />
      
      {isSidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <div className={styles.mainContent}>
        <AdminHeader 
          onMenuToggle={() => setIsSidebarOpen(true)} 
        />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};
