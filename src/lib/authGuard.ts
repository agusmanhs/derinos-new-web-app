import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import { isFieldAgentRole } from '@/lib/roleUtils';

export interface AuthContext {
  userId: string;
  roleName: string;
  permissions: string[];
  isSuperAdmin: boolean;
  isFieldAgent: boolean;
}

export const checkIsFieldAgent = isFieldAgentRole;

/**
 * Retrieves the current authenticated user's LIVE role and permissions.
 * Redirects to /login if unauthenticated.
 */
export async function getAuthContext(): Promise<AuthContext> {
  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/login');
  }

  let roleName = session.roleName || '';
  let permissions: string[] = session.permissions || [];

  const liveUser = await AuthService.getUserById(session.userId);
  if (!liveUser) {
    redirect('/login');
  }

  if (liveUser.role) {
    roleName = liveUser.role.name;
    permissions = liveUser.role.permissions || [];
  }

  const isSuperAdmin = roleName === 'Super Admin';
  const isFieldAgent = checkIsFieldAgent(roleName, permissions);

  return {
    userId: session.userId,
    roleName,
    permissions,
    isSuperAdmin,
    isFieldAgent,
  };
}

/**
 * Page-level RBAC Guard.
 * Requires the user to be authenticated and hold AT LEAST ONE of `requiredPermissions` (or be Super Admin).
 * Redirects unauthorized users safely without infinite loops.
 */
export async function requirePermission(requiredPermissions: string[]): Promise<AuthContext> {
  const ctx = await getAuthContext();

  if (ctx.isSuperAdmin || requiredPermissions.length === 0) {
    return ctx;
  }

  const hasAccess = requiredPermissions.some((p) => ctx.permissions.includes(p));
  if (!hasAccess) {
    if (ctx.isFieldAgent) {
      redirect('/admin/construction');
    }
    redirect('/admin');
  }

  return ctx;
}

/**
 * Server Action RBAC Guard.
 * Verifies authentication and checks live permissions without triggering a redirect.
 */
export async function assertActionPermission(
  requiredPermissions: string[]
): Promise<{ authorized: true; ctx: AuthContext } | { authorized: false; message: string }> {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { authorized: false, message: 'Unauthorized: Sesi login tidak valid atau telah berakhir.' };
  }

  let roleName = session.roleName || '';
  let permissions: string[] = session.permissions || [];

  const liveUser = await AuthService.getUserById(session.userId);
  if (!liveUser) {
    return { authorized: false, message: 'Unauthorized: Akun pengguna tidak ditemukan.' };
  }

  if (liveUser.role) {
    roleName = liveUser.role.name;
    permissions = liveUser.role.permissions || [];
  }

  const isSuperAdmin = roleName === 'Super Admin';
  const isFieldAgent = checkIsFieldAgent(roleName, permissions);

  if (isSuperAdmin || requiredPermissions.length === 0) {
    return {
      authorized: true,
      ctx: { userId: session.userId, roleName, permissions, isSuperAdmin, isFieldAgent },
    };
  }

  const hasAccess = requiredPermissions.some((p) => permissions.includes(p));
  if (!hasAccess) {
    return {
      authorized: false,
      message: 'Forbidden: Role Anda tidak memiliki izin untuk melakukan tindakan ini.',
    };
  }

  return {
    authorized: true,
    ctx: { userId: session.userId, roleName, permissions, isSuperAdmin, isFieldAgent },
  };
}
