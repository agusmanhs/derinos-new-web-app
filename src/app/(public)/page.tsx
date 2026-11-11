import React from 'react';
import { HeroSection } from '@/components/public/Home/HeroSection';
import { StatsCounter } from '@/components/public/Home/StatsCounter';
import {
  FeaturedProjectsSection,
  PublicProjectCard,
} from '@/components/public/Home/FeaturedProjectsSection';
import { HighlightClusterSection } from '@/components/public/Home/HighlightClusterSection';
import { ValuePillarsSection } from '@/components/public/Home/ValuePillarsSection';
import {
  HouseTypesSection,
  PublicHouseTypeItem,
} from '@/components/public/Home/HouseTypesSection';
import { AmenitiesSection } from '@/components/public/Home/AmenitiesSection';
import { LocationAccessSection } from '@/components/public/Home/LocationAccessSection';
import { TestimonialsSection } from '@/components/public/Home/TestimonialsSection';
import { ArticlesSection } from '@/components/public/Home/ArticlesSection';
import { ConsultationCTA } from '@/components/public/Home/ConsultationCTA';

import prisma from '@/lib/prisma';
import { getSiteSettings, getMasterFacilities } from '@/actions/adminLandingActions';

export const dynamic = 'force-dynamic';

interface StoredHouseType {
  id?: string;
  name?: string;
  buildingSize?: number | string;
  landSize?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  carports?: number | string;
  price?: number | string;
  description?: string;
  image?: string;
  startingPrice?: string;
  size?: {
    building?: number | string;
    land?: number | string;
  };
  specs?: {
    bedrooms?: number | string;
    bathrooms?: number | string;
    carports?: number | string;
  };
}

function formatCompactRupiah(price: number): string {
  if (!price || price <= 0) return 'Hubungi Kami';
  if (price >= 1_000_000_000) {
    const val = (price / 1_000_000_000)
      .toFixed(2)
      .replace(/\.?0+$/, '')
      .replace('.', ',');
    return `Rp ${val} Miliar`;
  }
  if (price >= 1_000_000) {
    const val = Math.round(price / 1_000_000);
    return `Rp ${val.toLocaleString('id-ID')} Juta`;
  }
  return `Rp ${price.toLocaleString('id-ID')}`;
}

function estimateKprInstallment(price: number): string {
  if (!price || price <= 0) return 'KPR Tersedia';
  const principal = price * 0.85; // asumsi DP 15%
  const monthlyRate = 0.065 / 12; // estimasi bunga 6.5% p.a.
  const months = 240; // tenor 20 thn
  const factor = Math.pow(1 + monthlyRate, months);
  const monthly = (principal * monthlyRate * factor) / (factor - 1);
  if (monthly >= 1_000_000) {
    return `Est. ~${(monthly / 1_000_000).toFixed(1).replace('.', ',')} Jt/bln`;
  }
  return `Est. ~Rp ${Math.round(monthly / 1_000).toLocaleString('id-ID')} rb/bln`;
}

export default async function Home() {
  const [activeProjects, settings, masterFacilities] = await Promise.all([
    prisma.project.findMany({
      where: { archived: false },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        properties: {
          where: { archived: false },
          select: {
            id: true,
            typeName: true,
            bedrooms: true,
            bathrooms: true,
            carports: true,
            buildingSize: true,
            landSize: true,
            price: true,
            propertyStatus: {
              select: { name: true },
            },
          },
        },
      },
    }),
    getSiteSettings(),
    getMasterFacilities(),
  ]);

  const featuredOnly = activeProjects.filter((p) => p.featured);
  const projectSource = featuredOnly.length > 0 ? featuredOnly : activeProjects;

  const projectCards: PublicProjectCard[] = projectSource.map((p) => {
    const rawTypes = Array.isArray(p.houseTypes) ? (p.houseTypes as unknown as StoredHouseType[]) : [];
    const availableCount =
      p.properties.length > 0
        ? p.properties.filter((u) => {
            const s = (u.propertyStatus?.name || '').toLowerCase();
            return s.includes('avail') || s.includes('ready') || s.includes('tersedia');
          }).length
        : p.availableUnits;

    // Cari spesifikasi representatif dari Master Tipe Rumah atau Unit nyata
    const firstType = rawTypes[0];
    const firstUnit = p.properties[0];

    const bedrooms = Number(
      firstType?.bedrooms ?? firstType?.specs?.bedrooms ?? firstUnit?.bedrooms ?? 0
    );
    const bathrooms = Number(
      firstType?.bathrooms ?? firstType?.specs?.bathrooms ?? firstUnit?.bathrooms ?? 0
    );
    const carports = Number(
      firstType?.carports ?? firstType?.specs?.carports ?? firstUnit?.carports ?? 0
    );
    const buildingArea = Number(
      firstType?.buildingSize ?? firstType?.size?.building ?? firstUnit?.buildingSize ?? 0
    );
    const landArea = Number(
      firstType?.landSize ?? firstType?.size?.land ?? firstUnit?.landSize ?? 0
    );

    const candidatePrices: number[] = [
      ...rawTypes.map((ht) => Number(ht.price || 0)),
      ...p.properties.map((u) => Number(u.price || 0)),
    ].filter((val) => val > 0);
    const minPrice = candidatePrices.length > 0 ? Math.min(...candidatePrices) : 0;

    const startingPrice =
      p.startingPrice && p.startingPrice.trim() !== '' && p.startingPrice.trim() !== '0'
        ? p.startingPrice
        : formatCompactRupiah(minPrice);

    let badge = p.status.toUpperCase();
    let badgeColor: 'terlaris' | 'unggulan' | 'terbaru' = 'terbaru';
    if (p.status === 'Ready to Move') {
      badge = 'SIAP HUNI';
      badgeColor = 'terlaris';
    } else if (p.featured) {
      badge = 'UNGGULAN';
      badgeColor = 'unggulan';
    }

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      badge,
      badgeColor,
      location: p.location || '-',
      startingPrice,
      image: p.heroImage || '/mockups/hero_placeholder.jpg',
      availableUnits: availableCount,
      totalUnits: p.properties.length > 0 ? p.properties.length : p.totalUnits,
      specs: {
        bedrooms,
        bathrooms,
        carports,
        buildingArea,
        landArea,
      },
    };
  });

  // Ekstrak Master Tipe Rumah nyata di tiap proyek (beserta foto fasad/render unggahan admin)
  const houseTypeCards: PublicHouseTypeItem[] = [];

  for (const p of activeProjects) {
    const rawTypes = Array.isArray(p.houseTypes) ? (p.houseTypes as unknown as StoredHouseType[]) : [];

    if (rawTypes.length > 0) {
      rawTypes.forEach((ht, idx) => {
        const buildingArea = Number(ht.buildingSize ?? ht.size?.building ?? 0);
        const landArea = Number(ht.landSize ?? ht.size?.land ?? 0);
        const bedrooms = Number(ht.bedrooms ?? ht.specs?.bedrooms ?? 0);
        const bathrooms = Number(ht.bathrooms ?? ht.specs?.bathrooms ?? 0);
        const carports = Number(ht.carports ?? ht.specs?.carports ?? 0);
        const numericPrice = Number(ht.price || 0);

        const startingPrice =
          numericPrice > 0
            ? formatCompactRupiah(numericPrice)
            : ht.startingPrice && ht.startingPrice !== '0'
              ? ht.startingPrice
              : 'Hubungi Kami';

        houseTypeCards.push({
          id: `${p.id}-${ht.id || idx}`,
          projectId: p.id,
          projectSlug: p.slug,
          projectTitle: p.title,
          name: ht.name || `Tipe ${buildingArea || '-'}`,
          typeCode: `${p.title}${buildingArea || landArea ? ` • LB ${buildingArea}/LT ${landArea} m²` : ''}`,
          badge: p.title,
          isPopular: p.featured && idx === 0,
          description:
            ht.description && String(ht.description).trim() !== ''
              ? String(ht.description)
              : `Hunian pilihan pada proyek ${p.title} di ${p.location}.`,
          image: ht.image || p.heroImage || '/mockups/hero_placeholder.jpg',
          startingPrice,
          installment: estimateKprInstallment(numericPrice),
          specs: {
            bedrooms,
            bathrooms,
            carports,
            buildingArea,
            landArea,
          },
        });
      });
    } else if (p.properties.length > 0) {
      // Fallback: ambil variasi tipe rumah dari unit nyata milik proyek jika master tipe belum dibuat
      const seen = new Map<string, (typeof p.properties)[0]>();
      for (const u of p.properties) {
        const key = (u.typeName || '').trim().toLowerCase();
        if (key && !seen.has(key)) {
          seen.set(key, u);
        }
      }
      let idx = 0;
      for (const [, u] of seen.entries()) {
        houseTypeCards.push({
          id: `${p.id}-unit-type-${idx}`,
          projectId: p.id,
          projectSlug: p.slug,
          projectTitle: p.title,
          name: u.typeName,
          typeCode: `${p.title} • LB ${u.buildingSize}/LT ${u.landSize} m²`,
          badge: p.title,
          isPopular: p.featured && idx === 0,
          description: `Pilihan unit ${u.typeName} pada proyek ${p.title}, ${p.location}.`,
          image: p.heroImage || '/mockups/hero_placeholder.jpg',
          startingPrice: formatCompactRupiah(u.price),
          installment: estimateKprInstallment(u.price),
          specs: {
            bedrooms: u.bedrooms || 0,
            bathrooms: u.bathrooms || 0,
            carports: u.carports || 0,
            buildingArea: u.buildingSize || 0,
            landArea: u.landSize || 0,
          },
        });
        idx++;
      }
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* 1. Hero Section */}
      <HeroSection settings={settings} />

      {/* 2. Statistics Counter Strip */}
      <StatsCounter settings={settings} />

      {/* 4. Proyek Pilihan untuk Anda */}
      <FeaturedProjectsSection projects={projectCards} />

      {/* 5. Highlight Cluster (Tinggal Nyaman, Bertumbuh Bersama Keluarga) */}
      <HighlightClusterSection />

      {/* 6. Nilai & Komitmen (Lebih dari Sekadar Rumah) */}
      <ValuePillarsSection />

      {/* 7. Pilihan Tipe Rumah Berdasarkan Proyek */}
      <HouseTypesSection houseTypes={houseTypeCards} />

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
