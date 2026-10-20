import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC<{ settings?: any }> = ({ settings }) => {
  const heroImage = settings?.heroImage || '/mockups/hero_placeholder.jpg';
  const heroTitle = settings?.heroTitle || 'Temukan Hunian yang Tepat untuk Masa Depan Anda';
  const heroSubtitle = settings?.heroSubtitle || 'Hunian modern dengan lokasi strategis, lingkungan nyaman, dan fasilitas yang memudahkan kehidupan keluarga.';
  const heroBadge = settings?.heroBadgeText || 'SOLUSI PROPERTI MASA DEPAN';
  const trustBadge1 = settings?.trustBadge1 || 'Legalitas Jelas & SHM';
  const trustBadge2 = settings?.trustBadge2 || 'Fasilitas Komplit';
  const trustBadge3 = settings?.trustBadge3 || 'Lokasi Bebas Banjir';

  return (
    <section className={styles.hero}>
      <Image
        src={heroImage}
        alt="Derinos Group Modern Residence"
        fill
        className={styles.bgImage}
        priority
      />
      <div className={styles.overlay} />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.pillBadge}>
            <span className={styles.pillDot} />
            <span>{heroBadge}</span>
          </div>

          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: heroTitle }} />
          <p className={styles.subtitle}>{heroSubtitle}</p>
          
          <div className={styles.actions}>
            <Link href="/projects" className={styles.btnPrimary}>
              <span>Lihat Proyek</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link href="/#kontak" className={styles.btnOutline}>
              Hubungi Kami
            </Link>
          </div>

          <div className={styles.trustBadges}>
            {trustBadge1 && (
              <div className={styles.badgeItem}>
                <span className={styles.checkIcon}>
                  <CheckIcon size={12} color="#F59E0B" />
                </span>
                <span>{trustBadge1}</span>
              </div>
            )}
            {trustBadge2 && (
              <div className={styles.badgeItem}>
                <span className={styles.checkIcon}>
                  <CheckIcon size={12} color="#F59E0B" />
                </span>
                <span>{trustBadge2}</span>
              </div>
            )}
            {trustBadge3 && (
              <div className={styles.badgeItem}>
                <span className={styles.checkIcon}>
                  <CheckIcon size={12} color="#F59E0B" />
                </span>
                <span>{trustBadge3}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
