import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { landingMockData } from '@/lib/landingMockData';
import styles from './HighlightClusterSection.module.css';

export const HighlightClusterSection: React.FC = () => {
  const { highlightCluster } = landingMockData;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'trees':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10v12"></path>
            <path d="M12 10a5 5 0 0 0-5-5H6a3 3 0 0 0-3 3v2a4 4 0 0 0 4 4h1"></path>
            <path d="M12 10a5 5 0 0 1 5-5h1a3 3 0 0 1 3 3v2a4 4 0 0 1-4 4h-1"></path>
          </svg>
        );
      case 'map':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
        );
      case 'shield-check':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
          </svg>
        );
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Big Image with Floating Card */}
          <div className={styles.imageColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src={highlightCluster.image}
                alt={highlightCluster.title}
                fill
                className={styles.image}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className={styles.floatingCard}>
                <h4 className={styles.floatingTitle}>{highlightCluster.floatingCardText}</h4>
                <p className={styles.floatingSub}>{highlightCluster.floatingCardSub}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Text & 4 Features Grid */}
          <div className={styles.contentColumn}>
            <span className={styles.tag}>{highlightCluster.badge}</span>
            <h2 className={styles.title}>{highlightCluster.title}</h2>
            <p className={styles.desc}>{highlightCluster.description}</p>

            <div className={styles.featuresGrid}>
              {highlightCluster.features.map((item, idx) => (
                <div key={idx} className={styles.featureCard}>
                  <div className={styles.iconCircle}>
                    {renderIcon(item.icon)}
                  </div>
                  <h3 className={styles.featureTitle}>{item.title}</h3>
                  <p className={styles.featureDesc}>{item.desc}</p>
                </div>
              ))}
            </div>

            <Link href="/projects" className={styles.ctaButton}>
              <span>Selengkapnya</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
