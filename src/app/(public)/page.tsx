import React from 'react';
import { HeroSection } from '@/components/public/Home/HeroSection';
import { IntroSection } from '@/components/public/Home/IntroSection';
import { PropertyShowcase } from '@/components/public/Home/PropertyShowcase';
import { FacilitiesSection } from '@/components/public/Home/FacilitiesSection';
import { GallerySection } from '@/components/public/Home/GallerySection';
import { CTASection } from '@/components/public/Home/CTASection';
import { ProjectService } from '@/services/projectService';

export default async function Home() {
  const stats = await ProjectService.getStats();
  const featuredProjects = await ProjectService.getFeaturedProjects();
  const facilities = await ProjectService.getFacilities();
  const galleryImages = await ProjectService.getGalleryImages();
  const projectOptions = await ProjectService.getProjectOptions();

  return (
    <main>
      <HeroSection stats={stats} />
      <IntroSection />
      <PropertyShowcase projects={featuredProjects} />
      <FacilitiesSection facilities={facilities} />
      <GallerySection images={galleryImages} />
      <CTASection projectOptions={projectOptions} />
    </main>
  );
}
