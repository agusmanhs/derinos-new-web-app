import React from 'react';
import Image from 'next/image';
import { Facility } from '@/types/project';
import styles from './FacilitiesSection.module.css';

export const FacilitiesSection: React.FC<{ facilities: any[] }> = ({ facilities }) => {
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
              <div className={styles.iconWrapper} style={{ color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {facility.iconSvg ? (
                  <div dangerouslySetInnerHTML={{ __html: facility.iconSvg }} style={{ width: '48px', height: '48px' }} />
                ) : (
                  <svg className={styles.fallbackSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px' }}>
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
