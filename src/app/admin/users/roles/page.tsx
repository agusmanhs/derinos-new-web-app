import React from 'react';
import { RoleService } from '@/services/roleService';
import { RoleListClient } from './RoleListClient';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminRolesPage() {
  const session = await verifySession();
  if (!session?.permissions.includes('manage_roles') && session?.roleName !== 'Super Admin') {
    redirect('/admin');
  }

  const roles = await RoleService.getRoles();
  const permissions = await RoleService.getPermissions();

  return <RoleListClient roles={roles} allPermissions={permissions} />;
}
