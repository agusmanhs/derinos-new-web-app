import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { landingMockData } from '@/lib/landingMockData';
import {
  CarIcon,
  TrainIcon,
  ShoppingBagIcon,
  HospitalIcon,
  MapPinIcon,
  HomeIcon
} from '@/components/ui/Icon/LandingIcons';
import styles from './LocationAccessSection.module.css';

export const LocationAccessSection: React.FC = () => {
  const { locationAccess } = landingMockData;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'car':
        return <CarIcon size={22} color="#0B192C" />;
      case 'train':
        return <TrainIcon size={22} color="#0B192C" />;
      case 'shopping-bag':
        return <ShoppingBagIcon size={22} color="#0B192C" />;
      case 'heart-pulse':
        return <HospitalIcon size={22} color="#0B192C" />;
      default:
        return <MapPinIcon size={22} color="#0B192C" />;
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Interactive Map Preview Card */}
          <div className={styles.mapColumn}>
            <div className={styles.mapCard}>
              <div className={styles.mapHeader}>
                <span className={styles.mapPinIcon}>
                  <MapPinIcon size={22} color="#D97706" />
                </span>
                <div>
                  <h4 className={styles.mapTitle}>Akses Cepat Menuju Segala Kebutuhan</h4>
                  <p className={styles.mapSub}>Terhubung langsung dengan jalan arteri & tol lingkar luar</p>
                </div>
              </div>

              <div className={styles.mapImageWrapper}>
                <Image
                  src={locationAccess.mapImage}
                  alt="Peta Lokasi Derinos Group"
                  fill
                  className={styles.mapImage}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={styles.pinMarker}>
                  <div className={styles.pulseEffect} />
                  <div className={styles.pinBadge}>
                    <HomeIcon size={14} color="#F59E0B" />
                    <span>Derinos Hub</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Distance & Time Points */}
          <div className={styles.contentColumn}>
            <span className={styles.tag}>{locationAccess.tag}</span>
            <h2 className={styles.title}>{locationAccess.title}</h2>
            <p className={styles.desc}>{locationAccess.subtitle}</p>

            <div className={styles.accessGrid}>
              {locationAccess.accessPoints.map((point, idx) => (
                <div key={idx} className={styles.accessCard}>
                  <div className={styles.iconCircle}>
                    <span>{renderIcon(point.icon)}</span>
                  </div>
                  <div>
                    <span className={styles.timeBadge}>{point.time}</span>
                    <h4 className={styles.destinationName}>{point.destination}</h4>
                  </div>
                </div>
              ))}
            </div>

            <Link href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
              <span>Petunjuk Arah</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
