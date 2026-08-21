'use server';

import { redirect } from 'next/navigation';
import { AuthService } from '@/services/authService';
import { createSession, deleteSession } from '@/lib/session';

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email and password are required' };
  }

  const user = await AuthService.authenticate(email, password);

  if (!user) {
    return { success: false, message: 'Invalid credentials. Try admin@derinos.com' };
  }

  // Create the secure HttpOnly cookie session
  await createSession(
    user.id, 
    user.role?.name || 'Guest', 
    user.role?.permissions || []
  );

  // Redirect to dashboard
  redirect('/admin');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/login');
}
