import React from 'react';
import { HeroSection } from '@/components/public/Home/HeroSection';
import { IntroSection } from '@/components/public/Home/IntroSection';
import { PropertyShowcase } from '@/components/public/Home/PropertyShowcase';
import { FacilitiesSection } from '@/components/public/Home/FacilitiesSection';
import { GallerySection } from '@/components/public/Home/GallerySection';
import { CTASection } from '@/components/public/Home/CTASection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IntroSection />
      <PropertyShowcase />
      <FacilitiesSection />
      <GallerySection />
      <CTASection />
    </main>
  );
}
