import React from 'react';
import { RoleService } from '@/services/roleService';
import { RoleListClient } from './RoleListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminRolesPage() {
  await requirePermission(['manage_roles']);

  const roles = await RoleService.getRoles();
  const permissions = await RoleService.getPermissions();

  return <RoleListClient roles={roles} allPermissions={permissions} />;
}
