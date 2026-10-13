import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Derinos Group" width={40} height={40} className={styles.logoImage} />
          <span>DERINOS GROUP</span>
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.link}>Beranda</Link>
          <Link href="/about" className={styles.link}>Tentang Kami</Link>
          <Link href="/projects" className={styles.link}>Proyek</Link>
          <Link href="/#tipe-rumah" className={styles.link}>Tipe Rumah</Link>
          <Link href="/#fasilitas" className={styles.link}>Fasilitas</Link>
          <Link href="/#berita" className={styles.link}>Berita</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/#kontak" className={styles.ctaButton}>
            Hubungi Kami
          </Link>
        </div>
      </div>
    </header>
  );
};
