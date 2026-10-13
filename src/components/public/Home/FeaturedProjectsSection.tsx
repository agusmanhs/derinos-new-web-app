import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import { landingMockData, MockProjectCard } from '@/lib/landingMockData';
import styles from './FeaturedProjectsSection.module.css';

interface Props {
  projects?: Project[];
}

export const FeaturedProjectsSection: React.FC<Props> = ({ projects = [] }) => {
  // Blend database projects with rich mock projects to guarantee a full, stunning 3-card showcase
  const displayCards: MockProjectCard[] = landingMockData.featuredProjects.map((mockItem, index) => {
    const dbProject = projects[index];
    if (dbProject) {
      return {
        id: dbProject.id,
        slug: dbProject.slug,
        title: dbProject.title,
        badge: index === 0 ? 'TERLARIS' : index === 1 ? 'UNGGULAN' : 'TERBARU',
        badgeColor: index === 0 ? 'terlaris' : index === 1 ? 'unggulan' : 'terbaru',
        location: dbProject.location || mockItem.location,
        startingPrice: dbProject.startingPrice || mockItem.startingPrice,
        image: dbProject.heroImage || mockItem.image,
        specs: mockItem.specs,
      };
    }
    return mockItem;
  });

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

        <div className={styles.grid}>
          {displayCards.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageContainer}>
                {item.badge && (
                  <span className={`${styles.badge} ${styles[item.badgeColor || 'terlaris']}`}>
                    {item.badge}
                  </span>
                )}
                <Image
                  src={item.image}
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
                  <span className={styles.priceLabel}>Mulai dari</span>
                  <span className={styles.priceValue}>{item.startingPrice}</span>
                </div>

                <div className={styles.specsRow}>
                  <div className={styles.specItem} title="Kamar Tidur">
                    <span className={styles.specIcon}>🛏️</span>
                    <span>{item.specs.bedrooms} KT</span>
                  </div>
                  <div className={styles.specItem} title="Kamar Mandi">
                    <span className={styles.specIcon}>🚿</span>
                    <span>{item.specs.bathrooms} KM</span>
                  </div>
                  <div className={styles.specItem} title="Carport">
                    <span className={styles.specIcon}>🚗</span>
                    <span>{item.specs.carports} Mobil</span>
                  </div>
                  <div className={styles.specItem} title="Luas Tanah">
                    <span className={styles.specIcon}>📐</span>
                    <span>{item.specs.landArea} m²</span>
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
