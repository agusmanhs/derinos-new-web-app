'use server';

import { revalidatePath } from 'next/cache';
import { UserService } from '@/services/userService';

export async function getUsersAction() {
  try {
    const users = await UserService.getUsers();
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function createUserAction(data: any) {
  try {
    const user = await UserService.createUser(data);
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to create user' };
  }
}

export async function updateUserAction(id: string, data: any) {
  try {
    const user = await UserService.updateUser(id, data);
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update user' };
  }
}

export async function deleteUserAction(id: string) {
  try {
    await UserService.deleteUser(id);
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to delete user' };
  }
}

export async function updateUserRoleAction(id: string, roleId: string) {
  try {
    const user = await UserService.updateUser(id, { roleId });
    revalidatePath('/admin/users');
    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to update user role' };
  }
}
