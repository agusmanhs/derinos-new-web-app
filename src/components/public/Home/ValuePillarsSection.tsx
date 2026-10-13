import React from 'react';
import Image from 'next/image';
import { landingMockData } from '@/lib/landingMockData';
import styles from './ValuePillarsSection.module.css';

export const ValuePillarsSection: React.FC = () => {
  const { valuePillars } = landingMockData;

  const renderIcon = (index: number) => {
    switch (index) {
      case 0:
        return '📍';
      case 1:
        return '🏗️';
      case 2:
        return '📜';
      case 3:
        return '🌿';
      case 4:
        return '🏊';
      case 5:
        return '📈';
      default:
        return '✨';
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>{valuePillars.tag}</span>
          <h2 className={styles.title}>{valuePillars.title}</h2>
          <p className={styles.subtitle}>{valuePillars.description}</p>
        </div>

        <div className={styles.layout}>
          {/* Left Column: Family photo with satisfaction badge */}
          <div className={styles.imageColumn}>
            <div className={styles.imageCard}>
              <Image
                src={valuePillars.image}
                alt="Kebahagiaan Penghuni Derinos Group"
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className={styles.badgeOverlay}>
                <span className={styles.badgeIcon}>★</span>
                <div>
                  <span className={styles.badgeText}>{valuePillars.imageBadge}</span>
                  <span className={styles.badgeSub}>Berdasarkan survey kepuasan penghuni</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Pillars Grid */}
          <div className={styles.pillarsGrid}>
            {valuePillars.pillars.map((item, idx) => (
              <div key={idx} className={styles.pillarCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.icon}>{renderIcon(idx)}</span>
                  <h3 className={styles.pillarTitle}>{item.title}</h3>
                </div>
                <p className={styles.pillarDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
