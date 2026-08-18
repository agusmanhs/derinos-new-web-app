import React from 'react';
import { facilities } from '@/lib/mockData';
import styles from './FacilitiesSection.module.css';

export const FacilitiesSection: React.FC = () => {
  return (
    <section className={styles.facilities}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Premium Facilities</h2>
          <p className={styles.subtitle}>Curated amenities for your elevated lifestyle.</p>
        </div>
        
        <div className={styles.grid}>
          {facilities.map((facility) => (
            <div key={facility.id} className={styles.card}>
              <div className={styles.iconPlaceholder} />
              <h3 className={styles.facilityName}>{facility.name}</h3>
              <p className={styles.facilityDesc}>{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
