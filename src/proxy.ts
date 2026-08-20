import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const session = await verifySession();

    // Not logged in -> redirect to login
    if (!session || !session.isAuth) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control (RBAC) Example
    // If they try to access /admin/users, require SUPER_ADMIN
    if (pathname.startsWith('/admin/users') && session.role !== 'SUPER_ADMIN') {
      const unauthorizedUrl = new URL('/admin', req.url); // Redirect to dashboard instead
      return NextResponse.redirect(unauthorizedUrl);
    }

    return NextResponse.next();
  }

  // Redirect logged-in users away from /login
  if (pathname === '/login') {
    const session = await verifySession();
    if (session && session.isAuth) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

// Ensure the middleware only runs on specific paths
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
