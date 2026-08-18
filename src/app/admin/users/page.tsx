import React from 'react';
import { AuthService } from '@/services/authService';
import { UserListClient } from './UserListClient';

export default async function AdminUsersPage() {
  const users = await AuthService.getUsers();

  return <UserListClient users={users} />;
}
