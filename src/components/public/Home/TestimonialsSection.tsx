import React from 'react';
import Image from 'next/image';
import { landingMockData, MockTestimonial } from '@/lib/landingMockData';
import { StarIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './TestimonialsSection.module.css';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = landingMockData;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>TESTIMONI PENGHUNI</span>
          <h2 className={styles.title}>Cerita dari Pemilik Rumah Kami</h2>
          <p className={styles.subtitle}>
            Pengalaman nyata dari keluarga yang telah mewujudkan hunian impian mereka bersama Derinos Group.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((item: MockTestimonial) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.starsRow}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <StarIcon key={i} size={18} color="#F59E0B" filled />
                ))}
              </div>

              <p className={styles.quoteText}>&ldquo;{item.content}&rdquo;</p>

              <div className={styles.authorRow}>
                <div className={styles.avatarWrapper}>
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={48}
                    height={48}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>{item.name}</h4>
                  <span className={styles.unitPurchased}>{item.unitPurchased}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
