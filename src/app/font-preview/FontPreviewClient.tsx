'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './FontPreviewClient.module.css';

interface FontOption {
  id: string;
  name: string;
  variable: string;
  badge: string;
  tagline: string;
  description: string;
  isRecommended?: boolean;
}

const FONTS: FontOption[] = [
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    variable: 'var(--font-jakarta)',
    badge: 'Rekomendasi Utama',
    tagline: 'Modern, Hangat & Prestisius',
    description: 'Font geometris kontemporer karya desainer Indonesia yang dipakai banyak brand properti & korporat modern. Memiliki lengkungan huruf yang ramah keluarga sekaligus arsitektur tipografi yang sangat kokoh.',
    isRecommended: true,
  },
  {
    id: 'outfit',
    name: 'Outfit',
    variable: 'var(--font-outfit)',
    badge: 'Alternatif Elegan',
    tagline: 'Minimalis Arsitektural & Geometris Mewah',
    description: 'Bentuk huruf berbasis geometris murni dengan aperture luas. Memberikan kesan proyek perumahan high-end, mewah, presisi, dan berskala nasional ala Ciputra / Sinarmas Land.',
  },
  {
    id: 'manrope',
    name: 'Manrope',
    variable: 'var(--font-manrope)',
    badge: 'Alternatif Presisi',
    tagline: 'Semi-Geometric, Rapi & Humanis',
    description: 'Perpaduan sempurna antara sans-serif geometris dan keterbacaan teknis yang tinggi. Angka-angka harga kavling, cicilan, dan ukuran luas tanah terlihat sangat seimbang dan rapi.',
  },
  {
    id: 'urbanist',
    name: 'Urbanist',
    variable: 'var(--font-urbanist)',
    badge: 'Alternatif Kontemporer',
    tagline: 'Modern, Fashionable & Tajam',
    description: 'Gaya tipografi netral yang ramping dan tajam. Sangat cocok jika Derinos ingin menampilkan citra villa, resort living, atau residensial urban yang sangat eksklusif.',
  },
  {
    id: 'inter',
    name: 'Inter',
    variable: 'var(--font-inter-preview)',
    badge: 'Font Eksisting',
    tagline: 'Fungsional & Netral',
    description: 'Font standar sistem antarmuka web. Sangat rapi untuk tabel admin, namun untuk headline properti terasa sedikit datar (terlalu tech-software).',
  },
];

export const FontPreviewClient: React.FC = () => {
  const [activeFontId, setActiveFontId] = useState<string>('jakarta');
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  const currentFont = FONTS.find(f => f.id === activeFontId) || FONTS[0];

  return (
    <div className={styles.container}>
      {/* 1. Sticky Navigation & Font Switcher */}
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brandLabel}>
            <Link href="/" className={styles.brandTitle}>
              <span>DERINOS</span>
              <span className={styles.brandBadge}>FONT LAB</span>
            </Link>
          </div>

          <div className={styles.fontSelectorGroup}>
            {FONTS.map(font => (
              <button
                key={font.id}
                type="button"
                className={`${styles.fontTabBtn} ${activeFontId === font.id && viewMode === 'single' ? styles.fontTabActive : ''}`}
                onClick={() => {
                  setActiveFontId(font.id);
                  setViewMode('single');
                }}
              >
                <span>{font.name}</span>
                {font.isRecommended && <span className={styles.starPill}>TOP</span>}
              </button>
            ))}

            <button
              type="button"
              className={`${styles.fontTabBtn} ${viewMode === 'compare' ? styles.fontTabActive : ''}`}
              onClick={() => setViewMode('compare')}
            >
              <span>Komparasi Berdampingan</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Header Introduction */}
      <section className={styles.headerSection}>
        <div className={styles.headerInner}>
          <div className={styles.pillBadge}>
            <span>Tipografi Non-Serif Derinos Group</span>
          </div>
          <h1 className={styles.mainTitle}>
            Uji Coba Visual Huruf Non-Serif
          </h1>
          <p className={styles.mainSubtitle}>
            Halaman ini menampilkan simulasi langsung font rekomendasi non-serif (sans-serif) pada elemen nyata Derinos: 
            judul hero publik, kartu kavling properti, angka harga/angsuran, dan panel eksekutif.
          </p>
        </div>
      </section>

      {/* 3. Main Content Showcase */}
      <main className={styles.contentArea}>
        {viewMode === 'single' ? (
          <>
            {/* Active Font Description Card */}
            <div className={styles.activeFontBanner} style={{ fontFamily: currentFont.variable }}>
              <div className={styles.activeFontInfo}>
                <div className={styles.activeFontName}>
                  <span>{currentFont.name}</span>
                  <span className={styles.badgeTag}>{currentFont.badge}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706', marginBottom: '2px' }}>
                  {currentFont.tagline}
                </div>
                <div className={styles.activeFontDesc}>
                  {currentFont.description}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Status Penerapan</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: currentFont.isRecommended ? '#059669' : '#0B192C', marginTop: '2px' }}>
                  {currentFont.isRecommended ? 'Pilihan Paling Ideal' : 'Opsi Alternatif'}
                </div>
              </div>
            </div>

            {/* Simulated Components with Active Font */}
            <div className={styles.sectionsStack} style={{ fontFamily: currentFont.variable }}>
              {/* SECTION A: Hero Website Publik */}
              <div className={styles.cardBox}>
                <div className={styles.cardHeaderBar}>
                  <span className={styles.cardCategory}>1. Simulasi Hero Banner Website Publik</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Font Aktif: <strong>{currentFont.name}</strong></span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.heroPreviewBox}>
                    <div className={styles.heroPreviewBadge}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
                      <span>Kawasan Hunian Modern & Asri</span>
                    </div>
                    <h2 className={styles.heroPreviewTitle}>
                      Wujudkan Rumah Idaman Bernuansa Alami untuk Keluarga Tercinta
                    </h2>
                    <p className={styles.heroPreviewSub}>
                      Derinos Group menghadirkan kawasan hunian eksklusif dengan arsitektur modern minimalis, 
                      keamanan one-gate system 24 jam, dan sertifikat SHM pecah siap akad.
                    </p>
                    <div className={styles.heroBtnRow}>
                      <button type="button" className={styles.heroPrimaryBtn}>
                        Lihat Pilihan Kavling
                      </button>
                      <button type="button" className={styles.heroSecondaryBtn}>
                        Jadwalkan Kunjungan Lokasi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION B: Property Unit Card & Price Tags */}
              <div className={styles.cardBox}>
                <div className={styles.cardHeaderBar}>
                  <span className={styles.cardCategory}>2. Kartu Unit & Pembacaan Harga / Angka</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Ketajaman Angka & Spesifikasi</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.componentsGrid}>
                    {/* Card 1 */}
                    <div className={styles.propCardDemo}>
                      <div className={styles.propCardBanner}>
                        <div>
                          <div className={styles.propCardCluster}>Cluster Titanium Residence</div>
                          <div className={styles.propCardTitle}>Tipe 36/72 Bougenville</div>
                        </div>
                      </div>
                      <div className={styles.propCardContent}>
                        <div className={styles.propPriceRow}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>HARGA MULAI</div>
                            <div className={styles.propPrice}>Rp 650.000.000</div>
                          </div>
                          <div className={styles.propCicilan}>
                            Cicilan Rp 3,8 Jt/bln
                          </div>
                        </div>
                        <div className={styles.propSpecsList}>
                          <div className={styles.specItem}>
                            <strong>2 KT</strong> Kamar Tidur
                          </div>
                          <div className={styles.specItem}>
                            <strong>1 KM</strong> Kamar Mandi
                          </div>
                          <div className={styles.specItem}>
                            <strong>1 Mobil</strong> Carport
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            SHM Pecah
                          </span>
                          <span style={{ background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Bebas BPHTB
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className={styles.propCardDemo}>
                      <div className={styles.propCardBanner} style={{ background: 'linear-gradient(135deg, #064E3B 0%, #0B192C 100%)' }}>
                        <div>
                          <div className={styles.propCardCluster}>Grand Hill Residence</div>
                          <div className={styles.propCardTitle}>Tipe 45/90 Comfort Deluxe</div>
                        </div>
                      </div>
                      <div className={styles.propCardContent}>
                        <div className={styles.propPriceRow}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>HARGA MULAI</div>
                            <div className={styles.propPrice}>Rp 980.000.000</div>
                          </div>
                          <div className={styles.propCicilan}>
                            Cicilan Rp 5,6 Jt/bln
                          </div>
                        </div>
                        <div className={styles.propSpecsList}>
                          <div className={styles.specItem}>
                            <strong>3 KT</strong> Kamar Tidur
                          </div>
                          <div className={styles.specItem}>
                            <strong>2 KM</strong> Kamar Mandi
                          </div>
                          <div className={styles.specItem}>
                            <strong>2 Mobil</strong> Carport
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Ready Stock
                          </span>
                          <span style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Subsidi Bunga 2.5%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className={styles.propCardDemo}>
                      <div className={styles.propCardBanner} style={{ background: 'linear-gradient(135deg, #312E81 0%, #0B192C 100%)' }}>
                        <div>
                          <div className={styles.propCardCluster}>Harmoni Gardenia Villa</div>
                          <div className={styles.propCardTitle}>Tipe 60/120 Signature Suite</div>
                        </div>
                      </div>
                      <div className={styles.propCardContent}>
                        <div className={styles.propPriceRow}>
                          <div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>HARGA MULAI</div>
                            <div className={styles.propPrice}>Rp 1.850.000.000</div>
                          </div>
                          <div className={styles.propCicilan}>
                            Cicilan Rp 10,2 Jt/bln
                          </div>
                        </div>
                        <div className={styles.propSpecsList}>
                          <div className={styles.specItem}>
                            <strong>4 KT</strong> Kamar Tidur
                          </div>
                          <div className={styles.specItem}>
                            <strong>3 KM</strong> Kamar Mandi
                          </div>
                          <div className={styles.specItem}>
                            <strong>Private Garden</strong> Rooftop
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <span style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Clubhouse View
                          </span>
                          <span style={{ background: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            Smart Home System
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C: Panel Admin & KPI Metrics */}
              <div className={styles.cardBox}>
                <div className={styles.cardHeaderBar}>
                  <span className={styles.cardCategory}>3. Simulasi Panel Admin & Executive Cockpit</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Angka Finansial & Persentase</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Nilai Total Transaksi Deals</div>
                      <div className={styles.statNum}>Rp 24,8 M</div>
                      <div className={styles.statSub}>+18.4% bulan ini</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Kavling Terjual (Cluster Alam Asri)</div>
                      <div className={styles.statNum}>92% Sold</div>
                      <div className={styles.statSub}>Sisa 8 unit tersedia</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>SLIK OJK Kolektibilitas 1</div>
                      <div className={styles.statNum}>100% Lolos</div>
                      <div className={styles.statSub}>5 pengajuan KPR disetujui</div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statLabel}>Suku Bunga KPR Promo</div>
                      <div className={styles.statNum}>3.75% Fixed</div>
                      <div className={styles.statSub}>Kerjasama Bank BTN & Mandiri</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION D: Specimen Characters */}
              <div className={styles.cardBox}>
                <div className={styles.cardHeaderBar}>
                  <span className={styles.cardCategory}>4. Karakter Lengkap Huruf & Angka (Specimen)</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Kekuatan Bentuk & Tracking</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.specimenAlphabet}>
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </div>
                  <div className={styles.specimenAlphabet} style={{ fontWeight: 400, color: '#334155' }}>
                    abcdefghijklmnopqrstuvwxyz
                  </div>
                  <div className={styles.specimenNumbers}>
                    0123456789 • (021) 884-9920 • Blok A-01 s/d Blok C-18 • Rp 650.000.000,-
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* COMPARISON VIEW (Side by Side) */
          <div className={styles.sideGrid}>
            {FONTS.map(font => (
              <div 
                key={font.id} 
                className={`${styles.sideCol} ${font.isRecommended ? styles.sideColRecommended : ''}`}
                style={{ fontFamily: font.variable }}
              >
                <div className={styles.sideColHeader}>
                  <div>
                    <div className={styles.sideColName}>{font.name}</div>
                    <div className={styles.sideColVibe}>{font.tagline}</div>
                  </div>
                  {font.isRecommended && <span className={styles.starPill}>TOP</span>}
                </div>

                <div className={styles.sideSampleTitle}>
                  Hunian Modern Bernuansa Asri untuk Keluarga Anda
                </div>

                <div className={styles.sideSampleBody}>
                  Kawasan perumahan eksklusif dengan sertifikat SHM pecah per kavling, keamanan 24 jam, dan fasilitas clubhouse terpadu.
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Harga & Spesifikasi</div>
                  <div className={styles.sideSampleNumbers}>
                    Rp 650.000.000
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                    Tipe 36/72 • Blok A-08 • Bunga 3.75%
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  {font.description}
                </div>

                <button
                  type="button"
                  className={styles.selectThisFontBtn}
                  onClick={() => {
                    setActiveFontId(font.id);
                    setViewMode('single');
                  }}
                >
                  Lihat Detail {font.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
