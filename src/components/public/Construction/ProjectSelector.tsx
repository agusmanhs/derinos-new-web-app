'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/Select/Select';
import styles from './ProjectSelector.module.css';

interface ProjectSelectorProps {
  projects: { slug: string; title: string }[];
  currentSlug: string;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, currentSlug }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSlug = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set('project', newSlug);
    router.push(`/construction?${params.toString()}`);
  };

  return (
    <div className={styles.selectorWrapper}>
      <h3 className={styles.label}>Select Project</h3>
      <Select
        value={currentSlug}
        onChange={handleSelect}
        options={projects.map(p => ({ label: p.title, value: p.slug }))}
        className={styles.select}
      />
    </div>
  );
};
