import { getMasterGallery } from '@/actions/adminLandingActions';
import { GalleryClient } from './GalleryClient';
import { requirePermission } from '@/lib/authGuard';

export default async function GalleryPage() {
  await requirePermission(['manage_projects']);
  const images = await getMasterGallery();
  return <GalleryClient initialImages={images} />;
}