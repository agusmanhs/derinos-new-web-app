import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import { AdminLayoutClient } from './AdminLayoutClient';
import './layout.module.css'; // For global admin styles if needed

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const user = await AuthService.getUserById(session.userId);

  if (!user) {
    redirect('/login');
  }

  return (
    <AdminLayoutClient user={user}>
      {children}
    </AdminLayoutClient>
  );
}
