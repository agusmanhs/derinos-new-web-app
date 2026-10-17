import React from 'react';
import Image from 'next/image';
import { landingMockData } from '@/lib/landingMockData';
import {
  BuildingIcon,
  PoolIcon,
  ShieldCheckIcon,
  LeafIcon,
  JoggingIcon,
  PlaygroundIcon,
  MosqueIcon,
  CardAccessIcon
} from '@/components/ui/Icon/LandingIcons';
import styles from './AmenitiesSection.module.css';

interface Props {
  facilities?: any[];
}

export const AmenitiesSection: React.FC<Props> = ({ facilities = [] }) => {
  const { amenities } = landingMockData;

  const getAmenityIcon = (name: string, index: number) => {
    const lower = name.toLowerCase();
    if (lower.includes('pool') || lower.includes('kolam') || lower.includes('renang')) return <PoolIcon size={22} color="#0B192C" />;
    if (lower.includes('security') || lower.includes('keamanan') || lower.includes('cctv')) return <ShieldCheckIcon size={22} color="#0B192C" />;
    if (lower.includes('clubhouse') || lower.includes('gedung')) return <BuildingIcon size={22} color="#0B192C" />;
    if (lower.includes('park') || lower.includes('taman') || lower.includes('hijau')) return <LeafIcon size={22} color="#0B192C" />;
    if (lower.includes('jogging') || lower.includes('track') || lower.includes('lari')) return <JoggingIcon size={22} color="#0B192C" />;
    if (lower.includes('playground') || lower.includes('anak') || lower.includes('bermain')) return <PlaygroundIcon size={22} color="#0B192C" />;
    if (lower.includes('ibadah') || lower.includes('masjid') || lower.includes('musholla')) return <MosqueIcon size={22} color="#0B192C" />;
    if (lower.includes('gate') || lower.includes('pintu') || lower.includes('kartu')) return <CardAccessIcon size={22} color="#0B192C" />;

    const fallbackIcons = [
      <BuildingIcon key="1" size={22} color="#0B192C" />,
      <PoolIcon key="2" size={22} color="#0B192C" />,
      <ShieldCheckIcon key="3" size={22} color="#0B192C" />,
      <LeafIcon key="4" size={22} color="#0B192C" />,
      <JoggingIcon key="5" size={22} color="#0B192C" />,
      <PlaygroundIcon key="6" size={22} color="#0B192C" />,
      <MosqueIcon key="7" size={22} color="#0B192C" />,
      <CardAccessIcon key="8" size={22} color="#0B192C" />,
    ];
    return fallbackIcons[index % fallbackIcons.length];
  };

  // Combine database facilities if available with mock amenities to show 8 complete items
  const displayList = amenities.list.map((item, index) => {
    const dbItem = facilities[index];
    if (dbItem) {
      return {
        id: dbItem.id,
        name: dbItem.name,
        desc: dbItem.description || item.desc,
      };
    }
    return item;
  });

  return (
    <section className={styles.section} id="fasilitas">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>{amenities.tag}</span>
          <h2 className={styles.title}>{amenities.title}</h2>
          <p className={styles.subtitle}>{amenities.subtitle}</p>
        </div>

        <div className={styles.layout}>
          {/* Left Column: Big Clubhouse/Pool image */}
          <div className={styles.imageColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src={amenities.mainImage}
                alt={amenities.mainImageTitle}
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className={styles.imageCaption}>
                <h3 className={styles.captionTitle}>{amenities.mainImageTitle}</h3>
                <p className={styles.captionSub}>{amenities.mainImageSubtitle}</p>
              </div>
            </div>
          </div>

          {/* Right Column: 8 Amenities Grid */}
          <div className={styles.amenitiesGrid}>
            {displayList.map((item, idx) => (
              <div key={item.id} className={styles.amenityCard}>
                <div className={styles.iconCircle}>
                  <span>{getAmenityIcon(item.name, idx)}</span>
                </div>
                <h4 className={styles.amenityName}>{item.name}</h4>
                <p className={styles.amenityDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
