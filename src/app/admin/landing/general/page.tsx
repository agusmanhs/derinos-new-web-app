import { getSiteSettings } from '@/actions/adminLandingActions';
import { GeneralSettingsClient } from './GeneralSettingsClient';

export default async function GeneralSettingsPage() {
  const settings = await getSiteSettings();
  return <GeneralSettingsClient initialSettings={settings} />;
}