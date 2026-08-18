import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button/Button';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC<{ stats: { availableProjects: number, cities: number } }> = ({ stats }) => {
  return (
    <section className={styles.hero}>
      <Image
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
        alt="Derinos Group Modern Residence"
        fill
        className={styles.bgImage}
        priority
      />
      <div className={styles.overlay} />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Build Your Future.<br/>Live Beyond Expectations.</h1>
          <p className={styles.subtitle}>Developing strategic, high quality modern residences in harmony with nature.</p>
          <div className={styles.actions}>
            <Link href="/projects">
              <Button variant="primary" size="lg">View Our Projects</Button>
            </Link>
          </div>
        </div>
        
        <div className={styles.stats}>
          <span>Available Projects: <strong>{stats.availableProjects}</strong></span>
          <span>Locations: <strong>{stats.cities} Cities</strong></span>
        </div>
      </div>
    </section>
  );
};
