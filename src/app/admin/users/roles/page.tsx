import React from 'react';
import { RoleService } from '@/services/roleService';
import { RoleListClient } from './RoleListClient';

export default async function AdminRolesPage() {
  const roles = await RoleService.getRoles();
  const permissions = await RoleService.getPermissions();

  return <RoleListClient roles={roles} allPermissions={permissions} />;
}
