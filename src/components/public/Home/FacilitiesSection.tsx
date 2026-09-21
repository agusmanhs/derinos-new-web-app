import React from 'react';
import Image from 'next/image';
import { Facility } from '@/types/project';
import styles from './FacilitiesSection.module.css';

export const FacilitiesSection: React.FC<{ facilities: Facility[] }> = ({ facilities }) => {
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
              <div className={styles.iconWrapper}>
                {facility.iconImage ? (
                  <Image src={facility.iconImage} alt={facility.name} fill className={styles.iconImage} />
                ) : (
                  <svg className={styles.fallbackSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                )}
              </div>
              <h3 className={styles.facilityName}>{facility.name}</h3>
              <p className={styles.facilityDesc}>{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
