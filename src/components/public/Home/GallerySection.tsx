import React from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.css';

export const GallerySection: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <section className={styles.gallery}>
      <div className={styles.container}>
        <h2 className={styles.title}>Project Gallery</h2>
        
        <div className={styles.grid}>
          {images.map((src, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <Image 
                src={src} 
                alt={`Gallery image ${idx + 1}`} 
                fill 
                className={styles.image} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
