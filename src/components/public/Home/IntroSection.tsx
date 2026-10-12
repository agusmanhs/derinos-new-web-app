import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { companyStats } from '@/lib/mockData';
import styles from './IntroSection.module.css';

export const IntroSection: React.FC<{ settings?: any }> = ({ settings }) => {
  const mainImage = settings?.introImageMain || '/mockups/gallery_1.jpg';
  const secondaryImage = settings?.introImageSecondary || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop';
  const yearsExp = settings?.yearsExperience || companyStats.yearsExperience;
  const completedProj = settings?.completedProjects || companyStats.completedProjects;

  return (
    <section className={styles.intro}>
      <div className={styles.container}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>{settings?.introTitle || 'Creating Places Worth Coming Home To.'}</h2>
          <p className={styles.description}>
            {settings?.introDescription || 'With an unwavering commitment to architecture, integrity and sustainable design, we craft residences that elevate the standard of living.'}
          </p>
          <Link href="/about" className={styles.link}>Read Our Story</Link>
        </div>
        
        <div className={styles.visualContent}>
          <div className={styles.imageGrid}>
            <div className={styles.imageWrapperMain}>
              <Image 
                src={mainImage} 
                alt="Architecture Detail" 
                fill 
                className={styles.image} 
              />
            </div>
            <div className={styles.imageWrapperSecondary}>
              <Image 
                src={secondaryImage} 
                alt="Interior Detail" 
                fill 
                className={styles.image} 
              />
            </div>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>{yearsExp}</span>
              <span className={styles.statLabel}>Years Experience</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>{completedProj}</span>
              <span className={styles.statLabel}>Completed Projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
