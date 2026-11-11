import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { landingMockData, MockProjectCard } from '@/lib/landingMockData';
import { BedIcon, BathIcon, CarIcon, AreaIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './FeaturedProjectsSection.module.css';

export interface PublicProjectCard extends MockProjectCard {
  availableUnits?: number;
  totalUnits?: number;
}

interface Props {
  projects?: PublicProjectCard[];
}

export const FeaturedProjectsSection: React.FC<Props> = ({ projects = [] }) => {
  // Tampilkan proyek nyata dari database; fallback ke mock hanya jika database proyek masih kosong
  const displayCards: PublicProjectCard[] =
    projects.length > 0 ? projects : landingMockData.featuredProjects;

  const gridModifierClass =
    displayCards.length === 1
      ? styles.gridSingle
      : displayCards.length === 2
        ? styles.gridDouble
        : '';

  return (
    <section className={styles.section} id="proyek">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.tag}>PROYEK KAMI</span>
            <h2 className={styles.title}>Proyek Pilihan untuk Anda</h2>
            <p className={styles.subtitle}>
              Temukan koleksi cluster terbaik yang dirancang untuk kenyamanan, keamanan, dan nilai investasi jangka panjang.
            </p>
          </div>
          <Link href="/projects" className={styles.viewAllLink}>
            <span>Lihat Semua Proyek</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className={`${styles.grid} ${gridModifierClass}`}>
          {displayCards.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {item.badge && (
                  <span className={`${styles.badge} ${styles[item.badgeColor || 'terlaris']}`}>
                    {item.badge}
                  </span>
                )}
                <Image
                  src={item.image || '/mockups/hero_placeholder.jpg'}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.locationRow}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{item.location}</span>
                </div>

                <h3 className={styles.projectTitle}>{item.title}</h3>

                <div className={styles.priceSection}>
                  <span className={styles.priceLabel}>
                    {typeof item.availableUnits === 'number' && item.availableUnits > 0
                      ? `Mulai dari • ${item.availableUnits} Unit Tersedia`
                      : 'Mulai dari'}
                  </span>
                  <span className={styles.priceValue}>{item.startingPrice}</span>
                </div>

                <div className={styles.specsRow}>
                  <div className={styles.specItem} title="Kamar Tidur">
                    <span className={styles.specIcon}><BedIcon size={16} color="#0B192C" /></span>
                    <span>{item.specs.bedrooms > 0 ? `${item.specs.bedrooms} KT` : '- KT'}</span>
                  </div>
                  <div className={styles.specItem} title="Kamar Mandi">
                    <span className={styles.specIcon}><BathIcon size={16} color="#0B192C" /></span>
                    <span>{item.specs.bathrooms > 0 ? `${item.specs.bathrooms} KM` : '- KM'}</span>
                  </div>
                  <div className={styles.specItem} title="Carport">
                    <span className={styles.specIcon}><CarIcon size={16} color="#0B192C" /></span>
                    <span>{item.specs.carports > 0 ? `${item.specs.carports} Mobil` : '- Mobil'}</span>
                  </div>
                  <div className={styles.specItem} title="Luas Tanah">
                    <span className={styles.specIcon}><AreaIcon size={16} color="#0B192C" /></span>
                    <span>{item.specs.landArea > 0 ? `${item.specs.landArea} m²` : '- m²'}</span>
                  </div>
                </div>

                <Link href={`/projects/${item.slug}`} className={styles.detailButton}>
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
