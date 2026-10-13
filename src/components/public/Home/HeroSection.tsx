import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC<{ settings?: any }> = ({ settings }) => {
  const heroImage = settings?.heroImage || '/mockups/hero_placeholder.jpg';
  const heroTitle = settings?.heroTitle || 'Temukan Hunian yang Tepat untuk Masa Depan Anda';
  const heroSubtitle = settings?.heroSubtitle || 'Hunian modern dengan lokasi strategis, lingkungan nyaman, dan fasilitas yang memudahkan kehidupan keluarga.';

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
            <span>SOLUSI PROPERTI MASA DEPAN</span>
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
            <div className={styles.badgeItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Legalitas Jelas & SHM</span>
            </div>
            <div className={styles.badgeItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Fasilitas Komplit</span>
            </div>
            <div className={styles.badgeItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Lokasi Bebas Banjir</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
