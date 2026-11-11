import React from 'react';
import { UserService } from '@/services/userService';
import { RoleService } from '@/services/roleService';
import { UserListClient } from './UserListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminUsersPage() {
  const ctx = await requirePermission(['manage_users']);

  const users = await UserService.getUsers();
  const roles = await RoleService.getRoles();

  return <UserListClient users={users} roles={roles} currentUserRole={ctx.roleName || ''} />;
}
