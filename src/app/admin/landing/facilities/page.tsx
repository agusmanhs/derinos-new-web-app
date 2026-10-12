import { getMasterFacilities } from '@/actions/adminLandingActions';
import { FacilitiesClient } from './FacilitiesClient';

export default async function FacilitiesPage() {
  const facilities = await getMasterFacilities();
  return <FacilitiesClient initialFacilities={facilities} />;
}