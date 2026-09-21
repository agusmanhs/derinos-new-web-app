import React from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.css';

export const GallerySection: React.FC<{ images: string[] }> = ({ images }) => {
  // Premium architectural fallback images if DB is empty
  const displayImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070&auto=format&fit=crop'
  ];

  return (
    <section className={styles.gallery}>
      <div className={styles.container}>
        <h2 className={styles.title}>Project Gallery</h2>
        
        <div className={styles.grid}>
          {displayImages.map((src, idx) => (
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
