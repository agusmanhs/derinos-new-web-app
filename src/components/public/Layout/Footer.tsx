import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ClockIcon, MapPinIcon, PhoneIcon, MailIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './Footer.module.css';

export const Footer: React.FC<{ settings?: any }> = ({ settings }) => {
  const address = settings?.contactAddress || 'Jl. Danau Tanjung Bunga, Makassar, Sulawesi Selatan';
  const phone = settings?.contactPhone || '+62 812-3456-7890';
  const email = settings?.contactEmail || 'marketing@derinosgroup.com';

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoRow}>
              <Image src="/logo.png" alt="Derinos Group Logo" width={38} height={38} className={styles.logoImg} />
              <span className={styles.logoText}>DERINOS GROUP</span>
            </Link>
            <p className={styles.brandDesc}>
              Pengembang properti terpercaya yang berkomitmen menghadirkan kawasan hunian modern, asri, dan bernilai investasi tinggi untuk masa depan keluarga Anda.
            </p>
            <div className={styles.operatingHours}>
              <span className={styles.hoursIcon}>
                <ClockIcon size={18} color="#F59E0B" />
              </span>
              <div>
                <strong>Jam Operasional Kantor:</strong>
                <p>09.00 - 17.00 WITA (Senin - Minggu)</p>
              </div>
            </div>
          </div>

          {/* Links 1: Tentang Kami */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>TENTANG KAMI</h4>
            <ul className={styles.linkList}>
              <li><Link href="/about" className={styles.link}>Profil Perusahaan</Link></li>
              <li><Link href="/projects" className={styles.link}>Portofolio Proyek</Link></li>
              <li><Link href="/#tipe-rumah" className={styles.link}>Pilihan Tipe Rumah</Link></li>
              <li><Link href="/#fasilitas" className={styles.link}>Fasilitas Kawasan</Link></li>
              <li><Link href="/construction" className={styles.link}>Update Pembangunan</Link></li>
            </ul>
          </div>

          {/* Links 2: Layanan & Panduan */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>LAYANAN & PANDUAN</h4>
            <ul className={styles.linkList}>
              <li><Link href="/#kontak" className={styles.link}>Konsultasi KPR Gratis</Link></li>
              <li><Link href="/#kontak" className={styles.link}>Simulasi Angsuran</Link></li>
              <li><Link href="/#berita" className={styles.link}>Tips & Berita Properti</Link></li>
              <li><Link href="/#kontak" className={styles.link}>Panduan Legalitas SHM</Link></li>
              <li><Link href="/login" className={styles.link}>Portal Internal Sales</Link></li>
            </ul>
          </div>

          {/* Links 3: Kontak & Alamat */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>HUBUNGI KAMI</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <MapPinIcon size={18} color="#F59E0B" />
                </span>
                <span>{address}</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <PhoneIcon size={18} color="#F59E0B" />
                </span>
                <span>{phone}</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>
                  <MailIcon size={18} color="#F59E0B" />
                </span>
                <span>{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} PT Derinos Karya Pratama. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Kebijakan Privasi</Link>
            <span>•</span>
            <Link href="/terms" className={styles.legalLink}>Syarat & Ketentuan</Link>
            <span>•</span>
            <Link href="/sitemap" className={styles.legalLink}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
