import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { CTASection } from '@/components/public/Home/CTASection';
import { Badge } from '@/components/ui/Badge/Badge';
import { Card } from '@/components/ui/Card/Card';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await ProjectService.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className={styles.main}>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <Image src={project.heroImage} alt={project.title} fill className={styles.heroBg} priority />
        <div className={styles.overlay} />
        <div className={styles.heroContent}>
          <div className={styles.heroHeader}>
            <Badge variant="neutral">{project.status}</Badge>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.location}>{project.location}</p>
          </div>
          
          <div className={styles.quickStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Area</span>
              <span className={styles.statValue}>{project.totalArea}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Units</span>
              <span className={styles.statValue}>{project.totalUnits}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Available</span>
              <span className={styles.statValue}>{project.availableUnits}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Overview Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.overview}>
            <h2 className={styles.sectionTitle}>Project Overview</h2>
            <p className={styles.description}>{project.description}</p>
          </div>
        </div>
      </section>

      {/* 3. Masterplan & House Types */}
      <section className={styles.sectionLight}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Masterplan & House Types</h2>
          <div className={styles.masterplanGrid}>
            <div className={styles.masterplanImageWrapper}>
              <Image src={project.masterplanImage} alt="Masterplan" fill className={styles.imageCover} />
            </div>
            <div className={styles.typesList}>
              {project.houseTypes.map(type => (
                <Card key={type.id} className={styles.typeCard}>
                  <div className={styles.typeImageWrapper}>
                    <Image src={type.image} alt={type.name} fill className={styles.imageCover} />
                  </div>
                  <Card.Body>
                    <h3 className={styles.typeName}>{type.name}</h3>
                    <p className={styles.typeSpecs}>
                      LB: {type.size.building}m² | LT: {type.size.land}m²
                    </p>
                    <div className={styles.typeIcons}>
                      <span>🛏 {type.specs.bedrooms} Bed</span>
                      <span>🚿 {type.specs.bathrooms} Bath</span>
                      <span>🚗 {type.specs.carports} Car</span>
                    </div>
                    <div className={styles.typePrice}>
                      Starting from <strong>{type.startingPrice}</strong>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Facilities */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Premium Facilities</h2>
          <div className={styles.facilitiesGrid}>
            {project.facilities.map(facility => (
              <div key={facility.id} className={styles.facilityItem}>
                <div className={styles.facilityIcon}>
                  {facility.iconImage && <Image src={facility.iconImage} alt={facility.name} fill className={styles.imageCover} />}
                </div>
                <h4>{facility.name}</h4>
                <p>{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Construction Progress */}
      <section className={styles.sectionLight}>
        <div className={styles.container}>
          <div className={styles.constructionHeader}>
            <h2 className={styles.sectionTitle}>Construction Progress</h2>
            <Link href={`/construction?project=${project.slug}`} className={styles.reportLink}>
              View Full Report →
            </Link>
          </div>
          
          <div className={styles.progressSummary}>
            <div className={styles.progressStat}>
              <span className={styles.statLabel}>Overall Progress</span>
              <span className={styles.statValueLarge}>{project.overallProgress}%</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.statLabel}>Target Completion</span>
              <span className={styles.statValue}>{project.targetCompletion}</span>
            </div>
            {project.constructionUpdates && project.constructionUpdates.length > 0 && (
              <div className={styles.latestUpdateSnippet}>
                <span className={styles.updateBadge}>Latest</span>
                <strong>{project.constructionUpdates[0].title}</strong>
                <p>{project.constructionUpdates[0].date}</p>
              </div>
            )}
          </div>

          <div className={styles.timeline}>
            {project.constructionPhases.map((phase, idx) => (
              <div key={phase.id} className={`${styles.timelineItem} ${styles[phase.status]}`}>
                <div className={styles.timelinePoint}>
                  <div className={styles.pointInner} />
                </div>
                <div className={styles.timelineContent}>
                  <h4>{phase.name}</h4>
                  <span className={styles.timelineStatus}>{phase.status}</span>
                  {phase.status === 'active' && phase.progress && (
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${phase.progress}%` }} />
                    </div>
                  )}
                </div>
                {idx < project.constructionPhases.length - 1 && <div className={styles.timelineLine} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Gallery */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <div className={styles.galleryGrid}>
            {project.gallery.map((img, idx) => (
              <div key={idx} className={styles.galleryImageWrapper}>
                <Image src={img} alt={`Gallery ${idx}`} fill className={styles.imageCover} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
