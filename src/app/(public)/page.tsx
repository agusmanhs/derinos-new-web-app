import React from 'react';
import { HeroSection } from '@/components/public/Home/HeroSection';
import { KprCalculatorBar } from '@/components/public/Home/KprCalculatorBar';
import { StatsCounter } from '@/components/public/Home/StatsCounter';
import { FeaturedProjectsSection } from '@/components/public/Home/FeaturedProjectsSection';
import { HighlightClusterSection } from '@/components/public/Home/HighlightClusterSection';
import { ValuePillarsSection } from '@/components/public/Home/ValuePillarsSection';
import { HouseTypesSection } from '@/components/public/Home/HouseTypesSection';
import { AmenitiesSection } from '@/components/public/Home/AmenitiesSection';
import { LocationAccessSection } from '@/components/public/Home/LocationAccessSection';
import { TestimonialsSection } from '@/components/public/Home/TestimonialsSection';
import { ArticlesSection } from '@/components/public/Home/ArticlesSection';
import { ConsultationCTA } from '@/components/public/Home/ConsultationCTA';

import { ProjectService } from '@/services/projectService';
import { getSiteSettings, getMasterFacilities } from '@/actions/adminLandingActions';

export default async function Home() {
  const featuredProjects = await ProjectService.getFeaturedProjects();
  const settings = await getSiteSettings();
  const masterFacilities = await getMasterFacilities();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* 1. Hero Section */}
      <HeroSection settings={settings} />

      {/* 2. Floating Quick KPR Calculator */}
      <KprCalculatorBar />

      {/* 3. Statistics Counter Strip */}
      <StatsCounter settings={settings} />

      {/* 4. Proyek Pilihan untuk Anda */}
      <FeaturedProjectsSection projects={featuredProjects} />

      {/* 5. Highlight Cluster (Tinggal Nyaman, Bertumbuh Bersama Keluarga) */}
      <HighlightClusterSection />

      {/* 6. Nilai & Komitmen (Lebih dari Sekadar Rumah) */}
      <ValuePillarsSection />

      {/* 7. Pilihan Tipe Rumah (Pilih Tipe Rumah yang Sesuai) */}
      <HouseTypesSection />

      {/* 8. Fasilitas Kawasan (Dirancang untuk Kehidupan yang Lebih Nyaman) */}
      <AmenitiesSection facilities={masterFacilities} />

      {/* 9. Lokasi & Aksesibilitas (Lokasi Strategis, Aktivitas Lebih Mudah) */}
      <LocationAccessSection />

      {/* 10. Testimoni Konsumen (Cerita dari Pemilik Rumah Kami) */}
      <TestimonialsSection />

      {/* 11. Artikel & Insight Properti */}
      <ArticlesSection />

      {/* 12. Mega Consultation CTA */}
      <ConsultationCTA settings={settings} />
    </main>
  );
}
