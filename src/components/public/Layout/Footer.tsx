import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandInfo}>
          <h2 className={styles.logo}>DERINOS<br/>GROUP</h2>
          <p className={styles.copyright}>
            © 2026 Derinos Group.<br/>All rights reserved.
          </p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms of Service</Link>
          </div>
          <div className={styles.linkGroup}>
            <Link href="/press" className={styles.link}>Press Kit</Link>
            <Link href="/investors" className={styles.link}>Investors</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
