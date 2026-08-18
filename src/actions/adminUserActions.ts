'use server';

import { revalidatePath } from 'next/cache';
import { AuthService } from '@/services/authService';
import { verifySession } from '@/lib/session';
import { User } from '@/types/auth';

export async function updateUserRoleAction(id: string, role: User['role']) {
  const session = await verifySession();
  
  // Strict check: Only SUPER_ADMIN can change roles
  if (!session || session.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }

  // Prevent super admin from changing their own role and losing access
  if (id === session.userId) {
    throw new Error('Cannot change your own role.');
  }

  await AuthService.updateUserRole(id, role);
  revalidatePath('/admin/users');
}
