'use server';

import { revalidatePath } from 'next/cache';
import { UserService } from '@/services/userService';
import { assertActionPermission } from '@/lib/authGuard';

export async function getUsersAction() {
  const auth = await assertActionPermission(['manage_users']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const users = await UserService.getUsers();
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createUserAction(data: any) {
  const auth = await assertActionPermission(['manage_users']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const user = await UserService.createUser(data);
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create user' };
  }
}

export async function updateUserAction(id: string, data: any) {
  const auth = await assertActionPermission(['manage_users']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const user = await UserService.updateUser(id, data);
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update user' };
  }
}

export async function deleteUserAction(id: string) {
  const auth = await assertActionPermission(['manage_users']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    await UserService.deleteUser(id);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete user' };
  }
}

export async function updateUserRoleAction(id: string, roleId: string) {
  const auth = await assertActionPermission(['manage_users']);
  if (!auth.authorized) return { success: false, message: auth.message };
  try {
    const user = await UserService.updateUser(id, { roleId });
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update user role' };
  }
}
