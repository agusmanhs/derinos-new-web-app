import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import { ProjectService } from '@/services/projectService';
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
  
  // Fetch projects to pass to sidebar
  const projects = await ProjectService.getProjects();

  return (
    <AdminLayoutClient user={user} projects={projects}>
      {children}
    </AdminLayoutClient>
  );
}
