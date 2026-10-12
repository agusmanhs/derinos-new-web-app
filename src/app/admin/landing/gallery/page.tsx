import { getMasterGallery } from '@/actions/adminLandingActions';
import { GalleryClient } from './GalleryClient';

export default async function GalleryPage() {
  const images = await getMasterGallery();
  return <GalleryClient initialImages={images} />;
}