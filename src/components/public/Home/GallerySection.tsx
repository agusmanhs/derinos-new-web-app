import React from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.css';

export const GallerySection: React.FC<{ images: string[] }> = ({ images }) => {
  // Premium architectural fallback images if DB is empty
  const displayImages = images && images.length > 0 ? images : [
    '/mockups/gallery_1.jpg',
    '/mockups/gallery_2.jpg',
    '/mockups/gallery_3.jpg',
    '/mockups/gallery_4.jpg'
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
