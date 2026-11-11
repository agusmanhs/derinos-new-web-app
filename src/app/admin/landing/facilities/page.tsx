import { getMasterFacilities } from '@/actions/adminLandingActions';
import { FacilitiesClient } from './FacilitiesClient';
import { requirePermission } from '@/lib/authGuard';

export default async function FacilitiesPage() {
  await requirePermission(['manage_projects']);
  const facilities = await getMasterFacilities();
  return <FacilitiesClient initialFacilities={facilities} />;
}