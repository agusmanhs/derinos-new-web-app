import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/session';

const ALLOWED_ROLES = ['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER'];

export default async function AdminConstructionLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session || !ALLOWED_ROLES.includes(session.role)) {
    redirect('/admin');
  }

  return <>{children}</>;
}
