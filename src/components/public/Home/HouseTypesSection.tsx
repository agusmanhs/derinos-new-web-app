'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { landingMockData, MockHouseType } from '@/lib/landingMockData';
import { BedIcon, BathIcon, CarIcon, AreaIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './HouseTypesSection.module.css';

export interface PublicHouseTypeItem extends MockHouseType {
  projectId?: string;
  projectSlug?: string;
  projectTitle?: string;
}

interface Props {
  houseTypes?: PublicHouseTypeItem[];
}

export const HouseTypesSection: React.FC<Props> = ({ houseTypes = [] }) => {
  const displaySource: PublicHouseTypeItem[] =
    houseTypes.length > 0 ? houseTypes : landingMockData.houseTypes;

  const projectFilters = useMemo(() => {
    const map = new Map<string, string>();
    displaySource.forEach((item) => {
      if (item.projectSlug && item.projectTitle) {
        map.set(item.projectSlug, item.projectTitle);
      }
    });
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }));
  }, [displaySource]);

  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>('all');

  const filteredItems = useMemo(() => {
    if (selectedProjectSlug === 'all') return displaySource;
    return displaySource.filter((item) => item.projectSlug === selectedProjectSlug);
  }, [displaySource, selectedProjectSlug]);

  const gridModifierClass =
    filteredItems.length === 1
      ? styles.gridSingle
      : filteredItems.length === 2
        ? styles.gridDouble
        : '';

  return (
    <section className={styles.section} id="tipe-rumah">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>PILIHAN TIPE HUNIAN</span>
          <h2 className={styles.title}>Pilih Tipe Rumah yang Sesuai</h2>
          <p className={styles.subtitle}>
            Berbagai pilihan tipe rumah dirancang fleksibel untuk kenyamanan dan kebutuhan keluarga Anda di setiap proyek kami.
          </p>
        </div>

        {projectFilters.length > 1 && (
          <div className={styles.filterPills} role="tablist" aria-label="Filter Tipe Rumah Berdasarkan Proyek">
            <button
              type="button"
              onClick={() => setSelectedProjectSlug('all')}
              className={`${styles.filterPill} ${selectedProjectSlug === 'all' ? styles.filterPillActive : ''}`}
            >
              Semua Proyek ({displaySource.length})
            </button>
            {projectFilters.map((prj) => (
              <button
                key={prj.slug}
                type="button"
                onClick={() => setSelectedProjectSlug(prj.slug)}
                className={`${styles.filterPill} ${selectedProjectSlug === prj.slug ? styles.filterPillActive : ''}`}
              >
                {prj.title}
              </button>
            ))}
          </div>
        )}

        <div className={`${styles.grid} ${gridModifierClass}`}>
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`${styles.card} ${item.isPopular ? styles.popularCard : ''}`}
            >
              <div className={styles.imageContainer}>
                {item.badge && (
                  <span className={`${styles.badge} ${item.isPopular ? styles.popularBadge : ''}`}>
                    {item.badge}
                  </span>
                )}
                <Image
                  src={item.image || '/mockups/hero_placeholder.jpg'}
                  alt={item.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.typeCode}>{item.typeCode}</div>
                <h3 className={styles.houseName}>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>

                <div className={styles.specsList}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>
                      <BedIcon size={16} color="#0B192C" />
                      <span>Kamar Tidur</span>
                    </span>
                    <span className={styles.specVal}>{item.specs.bedrooms || '-'} Kamar</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>
                      <BathIcon size={16} color="#0B192C" />
                      <span>Kamar Mandi</span>
                    </span>
                    <span className={styles.specVal}>{item.specs.bathrooms || '-'} Kamar</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>
                      <CarIcon size={16} color="#0B192C" />
                      <span>Carport</span>
                    </span>
                    <span className={styles.specVal}>{item.specs.carports || '-'} Mobil</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>
                      <AreaIcon size={16} color="#0B192C" />
                      <span>Luas Bangunan / Tanah</span>
                    </span>
                    <span className={styles.specVal}>
                      {item.specs.buildingArea || '-'} / {item.specs.landArea || '-'} m²
                    </span>
                  </div>
                </div>

                <div className={styles.priceContainer}>
                  <div>
                    <span className={styles.priceLabel}>Harga Mulai</span>
                    <span className={styles.priceValue}>{item.startingPrice}</span>
                  </div>
                  {item.installment && (
                    <div className={styles.installment}>
                      {item.installment}
                    </div>
                  )}
                </div>

                <Link 
                  href={item.projectSlug ? `/projects/${item.projectSlug}` : '/projects'} 
                  className={`${styles.ctaButton} ${item.isPopular ? styles.popularButton : ''}`}
                >
                  {item.projectTitle ? `Lihat Detail di ${item.projectTitle}` : 'Lihat Detail Unit'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
