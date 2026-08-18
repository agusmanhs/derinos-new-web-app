'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import styles from './ProjectFilters.module.css';

export interface ProjectFiltersProps {
  locations: string[];
  statuses: string[];
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({ locations, statuses }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className={styles.filters}>
      <Input
        placeholder="Search projects..."
        defaultValue={searchParams.get('search') || ''}
        onChange={() => {
          // simple handler for change
        }}
        onBlur={(e) => handleFilterChange('search', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleFilterChange('search', e.currentTarget.value);
          }
        }}
        className={styles.searchInput}
      />
      
      <div className={styles.dropdowns}>
        <Select
          value={searchParams.get('location') || 'All'}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          options={locations.map(loc => ({ label: loc, value: loc }))}
        />

        <Select
          value={searchParams.get('status') || 'All'}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          options={statuses.map(stat => ({ label: stat, value: stat }))}
        />
      </div>
    </div>
  );
};
