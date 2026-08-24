import React from 'react';
import { UserService } from '@/services/userService';
import { RoleService } from '@/services/roleService';
import { UserListClient } from './UserListClient';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const session = await verifySession();
  if (!session?.permissions.includes('manage_users') && session?.roleName !== 'Super Admin') {
    redirect('/admin');
  }

  const users = await UserService.getUsers();
  const roles = await RoleService.getRoles();

  return <UserListClient users={users} roles={roles} currentUserRole={session?.roleName || ''} />;
}
