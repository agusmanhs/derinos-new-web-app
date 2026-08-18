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
          <Link href="/projects" className={styles.link}>Projects</Link>
          <Link href="/properties" className={styles.link}>Properties</Link>
          <Link href="/construction" className={styles.link}>Construction</Link>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
        </nav>
        <div className={styles.actions}>
          <Link href="/properties" className={styles.cta}>
            Explore Properties
          </Link>
        </div>
      </div>
    </header>
  );
};
