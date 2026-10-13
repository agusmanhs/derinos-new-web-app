import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { landingMockData, MockHouseType } from '@/lib/landingMockData';
import styles from './HouseTypesSection.module.css';

export const HouseTypesSection: React.FC = () => {
  const { houseTypes } = landingMockData;

  return (
    <section className={styles.section} id="tipe-rumah">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>PILIHAN TIPE HUNIAN</span>
          <h2 className={styles.title}>Pilih Tipe Rumah yang Sesuai</h2>
          <p className={styles.subtitle}>
            Berbagai pilihan tipe rumah dirancang fleksibel untuk kenyamanan dan kebutuhan keluarga Anda.
          </p>
        </div>

        <div className={styles.grid}>
          {houseTypes.map((item: MockHouseType) => (
            <div 
              key={item.id} 
              className={`${styles.card} ${item.isPopular ? styles.popularCard : ''}`}
            >
              <div className={styles.imageContainer}>
                {item.badge && (
                  <span className={`${styles.badge} ${item.isPopular ? styles.popularBadge : ''}`}>
                    {item.badge}
                  </span>
                )}
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.typeCode}>{item.typeCode}</div>
                <h3 className={styles.houseName}>{item.name}</h3>
                <p className={styles.description}>{item.description}</p>

                <div className={styles.specsList}>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>🛏️ Kamar Tidur</span>
                    <span className={styles.specVal}>{item.specs.bedrooms} Kamar</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>🚿 Kamar Mandi</span>
                    <span className={styles.specVal}>{item.specs.bathrooms} Kamar</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>🚗 Carport</span>
                    <span className={styles.specVal}>{item.specs.carports} Mobil</span>
                  </div>
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>📐 Luas Bangunan / Tanah</span>
                    <span className={styles.specVal}>{item.specs.buildingArea} / {item.specs.landArea} m²</span>
                  </div>
                </div>

                <div className={styles.priceContainer}>
                  <div>
                    <span className={styles.priceLabel}>Harga Mulai</span>
                    <span className={styles.priceValue}>{item.startingPrice}</span>
                  </div>
                  <div className={styles.installment}>
                    {item.installment}
                  </div>
                </div>

                <Link 
                  href="/projects" 
                  className={`${styles.ctaButton} ${item.isPopular ? styles.popularButton : ''}`}
                >
                  Lihat Detail Unit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
