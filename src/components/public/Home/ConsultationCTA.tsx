import React from 'react';
import Link from 'next/link';
import styles from './ConsultationCTA.module.css';

export const ConsultationCTA: React.FC<{ settings?: any }> = ({ settings }) => {
  const phone = settings?.contactPhone || '6281234567890';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=Halo%20Derinos%20Group,%20saya%20tertarik%20dengan%20proyek%20hunian%20Anda.`;

  return (
    <section className={styles.section} id="kontak">
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.textContent}>
            <div className={styles.badgeWrapper}>
              <span className={styles.badge}>KONSULTASI GRATIS SEKARANG</span>
            </div>
            <h2 className={styles.title}>
              Temukan Rumah yang Bisa Menjadi Cerita Baru Anda
            </h2>
            <p className={styles.subtitle}>
              Konsultasikan kebutuhan properti Anda bersama tim spesialis kami. Dapatkan penawaran unit terbaik, promo cicilan menarik, dan pendampingan proses KPR hingga tuntas.
            </p>
          </div>

          <div className={styles.actionButtons}>
            <Link href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
              <span>Jadwalkan Kunjungan</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link href={waUrl} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
              <span className={styles.waIcon}>💬</span>
              <span>Chat WhatsApp</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
