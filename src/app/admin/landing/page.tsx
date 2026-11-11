import { redirect } from 'next/navigation';
import { requirePermission } from '@/lib/authGuard';

export default async function LandingPage() {
  await requirePermission(['manage_projects']);
  redirect('/admin/landing/general');
}