import React from 'react';
import styles from './StatsCounter.module.css';

export const StatsCounter: React.FC<{ settings?: any }> = ({ settings }) => {
  const statsBadge = settings?.statsBadgeText || 'TERPERCAYA & BERPENGALAMAN';
  const stats = [
    {
      value: settings?.yearsExperience || '15+',
      label: settings?.yearsExperienceLabel || 'Tahun Pengalaman',
      desc: settings?.yearsExperienceDesc || 'Dedikasi melayani dan membangun hunian berkualitas tinggi sejak 2014',
    },
    {
      value: settings?.completedProjects || '24',
      label: settings?.completedProjectsLabel || 'Proyek Selesai',
      desc: settings?.completedProjectsDesc || 'Cluster perumahan terpadu di kawasan strategis berkembang',
    },
    {
      value: settings?.unitsSold || '1.000+',
      label: settings?.unitsSoldLabel || 'Unit Terjual',
      desc: settings?.unitsSoldDesc || 'Keluarga yang telah mempercayakan hunian impian mereka',
    },
    {
      value: settings?.customerSatisfaction || '95%',
      label: settings?.customerSatisfactionLabel || 'Kepuasan Klien',
      desc: settings?.customerSatisfactionDesc || 'Testimoni positif terhadap kualitas bangunan & legalitas',
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.topBadgeWrapper}>
          <span className={styles.topBadge}>
            <span className={styles.dot} />
            {statsBadge}
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
