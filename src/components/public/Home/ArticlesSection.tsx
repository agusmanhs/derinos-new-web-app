import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { landingMockData, MockArticle } from '@/lib/landingMockData';
import styles from './ArticlesSection.module.css';

export const ArticlesSection: React.FC = () => {
  const { articles } = landingMockData;

  return (
    <section className={styles.section} id="berita">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.tag}>ARTIKEL & INFORMASI</span>
            <h2 className={styles.title}>Informasi & Insight Properti</h2>
            <p className={styles.subtitle}>
              Informasi terbaru seputar tren properti, tips hunian, dan perkembangan proyek kami.
            </p>
          </div>
          <Link href="/projects" className={styles.viewAllLink}>
            <span>Semua Artikel</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className={styles.grid}>
          {articles.map((item: MockArticle) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <span className={styles.categoryBadge}>{item.category}</span>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.metaRow}>
                  <span>📅 {item.date}</span>
                  <span>•</span>
                  <span>⏱️ {item.readTime}</span>
                </div>

                <h3 className={styles.articleTitle}>{item.title}</h3>
                <p className={styles.summary}>{item.summary}</p>

                <Link href={`/projects`} className={styles.readMore}>
                  <span>Baca Selengkapnya</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
