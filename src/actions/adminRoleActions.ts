'use server';

import { revalidatePath } from 'next/cache';
import { RoleService } from '@/services/roleService';
import { assertActionPermission } from '@/lib/authGuard';

export async function getRolesAction() {
  const auth = await assertActionPermission(['manage_roles', 'manage_users']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const roles = await RoleService.getRoles();
    return { success: true, data: roles };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getPermissionsAction() {
  const auth = await assertActionPermission(['manage_roles']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const permissions = await RoleService.getPermissions();
    return { success: true, data: permissions };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createRoleAction(name: string, description: string) {
  const auth = await assertActionPermission(['manage_roles']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const role = await RoleService.createRole(name, description);
    revalidatePath('/admin/users/roles');
    return { success: true, data: role };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create role' };
  }
}

export async function updateRoleAction(id: string, name: string, description: string) {
  const auth = await assertActionPermission(['manage_roles']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const role = await RoleService.updateRole(id, name, description);
    revalidatePath('/admin/users/roles');
    return { success: true, data: role };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update role' };
  }
}

export async function deleteRoleAction(id: string) {
  const auth = await assertActionPermission(['manage_roles']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    await RoleService.deleteRole(id);
    revalidatePath('/admin/users/roles');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete role' };
  }
}

export async function togglePermissionAction(roleId: string, permissionId: string, isAssigned: boolean) {
  const auth = await assertActionPermission(['manage_roles']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    if (isAssigned) {
      await RoleService.removePermission(roleId, permissionId);
    } else {
      await RoleService.assignPermission(roleId, permissionId);
    }
    revalidatePath('/admin/users/roles');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to toggle permission' };
  }
}
