import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectService } from '@/services/projectService';
import { ProjectFilters } from '@/components/public/Projects/ProjectFilters';
import { Card } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import styles from './page.module.css';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  const search = params.search;
  const location = params.location;
  const status = params.status;

  const projects = await ProjectService.getProjects({ search, location, status });
  const locations = await ProjectService.getLocations();
  const statuses = await ProjectService.getStatuses();

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Our Projects</h1>
        <p className={styles.subtitle}>Explore our portfolio of premium developments.</p>
      </div>

      <div className={styles.container}>
        <ProjectFilters locations={locations} statuses={statuses} />

        {projects.length === 0 ? (
          <EmptyState 
            title="No projects found" 
            description="We couldn't find any projects matching your current filters. Try adjusting your search criteria." 
          />
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => (
              <Link href={`/projects/${project.slug}`} key={project.id} className={styles.cardLink}>
                <Card className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.badges}>
                      <Badge variant={project.status === 'Ready to Move' ? 'success' : project.status === 'Sold Out' ? 'neutral' : 'warning'}>
                        {project.status}
                      </Badge>
                      {project.featured && <Badge variant="neutral">Featured</Badge>}
                    </div>
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
