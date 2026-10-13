import React from 'react';
import { landingMockData } from '@/lib/landingMockData';
import styles from './StatsCounter.module.css';

export const StatsCounter: React.FC<{ settings?: any }> = ({ settings }) => {
  const stats = [
    {
      value: settings?.yearsExperience || landingMockData.stats[0].value,
      label: landingMockData.stats[0].label,
      desc: landingMockData.stats[0].desc,
    },
    {
      value: settings?.completedProjects || landingMockData.stats[1].value,
      label: landingMockData.stats[1].label,
      desc: landingMockData.stats[1].desc,
    },
    {
      value: landingMockData.stats[2].value,
      label: landingMockData.stats[2].label,
      desc: landingMockData.stats[2].desc,
    },
    {
      value: landingMockData.stats[3].value,
      label: landingMockData.stats[3].label,
      desc: landingMockData.stats[3].desc,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topBadgeWrapper}>
          <span className={styles.topBadge}>
            <span className={styles.dot} />
            TERPERCAYA & BERPENGALAMAN
          </span>
        </div>

        <div className={styles.grid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.valueRow}>
                <span className={styles.value}>{stat.value}</span>
              </div>
              <h3 className={styles.label}>{stat.label}</h3>
              <p className={styles.desc}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
