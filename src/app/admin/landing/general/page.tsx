import { getSiteSettings } from '@/actions/adminLandingActions';
import { GeneralSettingsClient } from './GeneralSettingsClient';
import { requirePermission } from '@/lib/authGuard';

export default async function GeneralSettingsPage() {
  await requirePermission(['manage_projects']);
  const settings = await getSiteSettings();
  return <GeneralSettingsClient initialSettings={settings} />;
}