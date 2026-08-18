import React from 'react';
import Image from 'next/image';
import { ProjectService } from '@/services/projectService';
import { ProjectSelector } from '@/components/public/Construction/ProjectSelector';
import styles from './page.module.css';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function ConstructionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const projects = await ProjectService.getProjects();
  
  if (projects.length === 0) {
    return <div>No projects found.</div>;
  }

  // Default to the first project if no query param is provided
  const currentSlug = params.project || projects[0].slug;
  const activeProject = projects.find(p => p.slug === currentSlug) || projects[0];

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Construction Updates</h1>
        <p className={styles.subtitle}>Track the building progress of our developments.</p>
      </div>

      <div className={styles.container}>
        <ProjectSelector 
          projects={projects.map(p => ({ slug: p.slug, title: p.title }))} 
          currentSlug={activeProject.slug} 
        />

        <div className={styles.contentGrid}>
          {/* Main Left Column */}
          <div className={styles.mainCol}>
            {/* Overall Progress Dashboard */}
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardHeader}>
                <h2>{activeProject.title}</h2>
                <div className={styles.targetDate}>
                  <span>Target Completion:</span>
                  <strong>{activeProject.targetCompletion}</strong>
                </div>
              </div>
              
              <div className={styles.progressSection}>
                <div className={styles.progressRing}>
                  <div className={styles.progressCircle} style={{ background: `conic-gradient(var(--color-primary) ${activeProject.overallProgress}%, var(--color-border) 0)` }}>
                    <div className={styles.progressInner}>
                      <span className={styles.progressNumber}>{activeProject.overallProgress}%</span>
                      <span className={styles.progressLabel}>Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Updates */}
            <div className={styles.updatesSection}>
              <h3 className={styles.sectionTitle}>Latest Updates</h3>
              <div className={styles.updatesList}>
                {activeProject.constructionUpdates.map((update) => (
                  <div key={update.id} className={styles.updateCard}>
                    {update.image && (
                      <div className={styles.updateImage}>
                        <Image src={update.image} alt={update.title} fill className={styles.imageCover} />
                      </div>
                    )}
                    <div className={styles.updateContent}>
                      <span className={styles.updateDate}>{update.date}</span>
                      <h4 className={styles.updateTitle}>{update.title}</h4>
                      <p className={styles.updateDesc}>{update.description}</p>
                    </div>
                  </div>
                ))}
                {activeProject.constructionUpdates.length === 0 && (
                  <p className={styles.emptyText}>No recent updates.</p>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div className={styles.gallerySection}>
              <h3 className={styles.sectionTitle}>Construction Gallery</h3>
              <div className={styles.galleryGrid}>
                {activeProject.constructionGallery.map((img, idx) => (
                  <div key={idx} className={styles.galleryItem}>
                    <Image src={img} alt={`Construction ${idx}`} fill className={styles.imageCover} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Right Column */}
          <div className={styles.sidebarCol}>
            {/* Milestones Vertical Timeline */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Key Milestones</h3>
              <div className={styles.verticalTimeline}>
                {activeProject.milestones.map((milestone, idx) => (
                  <div key={milestone.id} className={`${styles.timelineItem} ${milestone.completed ? styles.completed : ''}`}>
                    <div className={styles.timelinePoint}>
                      <div className={styles.pointInner} />
                    </div>
                    {idx < activeProject.milestones.length - 1 && <div className={styles.timelineLine} />}
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineDate}>{milestone.date}</span>
                      <h4 className={styles.timelineTitle}>{milestone.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
