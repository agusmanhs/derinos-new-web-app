'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './QuickSearchBar.module.css';

export const QuickSearchBar: React.FC = () => {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (priceRange) params.set('price', priceRange);
    if (location) params.set('location', location);
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleWithIcon}>
            <span className={styles.iconCircle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </span>
            <span className={styles.title}>Cari Hunian Impian Anda</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Kategori</label>
            <div className={styles.selectWrapper}>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
              >
                <option value="">Semua Kategori</option>
                <option value="cluster">Cluster Modern</option>
                <option value="komersial">Rumah Komersial</option>
                <option value="subsidi">Rumah Subsidi</option>
                <option value="villa">Resort & Villa</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Rentang Harga</label>
            <div className={styles.selectWrapper}>
              <select 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className={styles.select}
              >
                <option value="">Semua Harga</option>
                <option value="under-400">Di bawah Rp 400 Juta</option>
                <option value="400-700">Rp 400 Jt - Rp 700 Juta</option>
                <option value="above-700">Di atas Rp 700 Juta</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Lokasi</label>
            <div className={styles.selectWrapper}>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className={styles.select}
              >
                <option value="">Semua Lokasi</option>
                <option value="Barombong">Barombong</option>
                <option value="Gowa">Gowa</option>
                <option value="Makassar">Makassar</option>
                <option value="Maros">Maros</option>
                <option value="Bandung">Bandung Barat</option>
              </select>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.searchButton}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Cari Properti</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
