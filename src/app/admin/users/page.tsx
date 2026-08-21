import React from 'react';
import { UserService } from '@/services/userService';
import { RoleService } from '@/services/roleService';
import { UserListClient } from './UserListClient';

export default async function AdminUsersPage() {
  const users = await UserService.getUsers();
  const roles = await RoleService.getRoles();

  return <UserListClient users={users} roles={roles} />;
}
