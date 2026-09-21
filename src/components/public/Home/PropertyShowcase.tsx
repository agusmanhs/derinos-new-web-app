import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import styles from './PropertyShowcase.module.css';

export const PropertyShowcase: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <section className={styles.showcase}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Discover Our Properties</h2>
            <p className={styles.subtitle}>Curated selections of premium developments.</p>
          </div>
          <Link href="/projects" className={styles.viewAll}>View All</Link>
        </div>
        
        <div className={styles.grid}>
          {projects.map((project) => {
            const imageSrc = project.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop';
            return (
              <Card key={project.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {project.featured && (
                    <div className={styles.badgeWrapper}>
                      <Badge variant="primary">Featured</Badge>
                    </div>
                  )}
                  <Image 
                    src={imageSrc} 
                    alt={project.title} 
                    fill 
                    className={styles.image} 
                  />
                </div>
                <Card.Body className={styles.cardBody}>
                  <div>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.location}>{project.location}</p>
                  </div>
                  <div className={styles.priceInfo}>
                    <span className={styles.priceLabel}>Starting From</span>
                    <span className={styles.priceValue}>{project.startingPrice}</span>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
