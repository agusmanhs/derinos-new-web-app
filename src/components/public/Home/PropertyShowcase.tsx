import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProjects } from '@/lib/mockData';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import styles from './PropertyShowcase.module.css';

export const PropertyShowcase: React.FC = () => {
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
          {featuredProjects.map((project) => (
            <Card key={project.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {project.featured && (
                  <div className={styles.badgeWrapper}>
                    <Badge variant="neutral">Featured</Badge>
                  </div>
                )}
                <Image 
                  src={project.heroImage} 
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
          ))}
        </div>
      </div>
    </section>
  );
};
