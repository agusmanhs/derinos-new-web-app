'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import { Button } from '@/components/ui/Button/Button';
import styles from './PropertyFilters.module.css';

export interface PropertyFiltersProps {
  projects: string[];
  types: string[];
  statuses: string[];
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ projects, types, statuses }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 whenever filters change
    params.delete('page');
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/properties');
  };

  return (
    <div className={styles.filtersWrapper}>
      <div className={styles.topRow}>
        <Input
          placeholder="Search unit number or project..."
          defaultValue={searchParams.get('search') || ''}
          onChange={() => {}}
          onBlur={(e) => handleFilterChange('search', e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleFilterChange('search', e.currentTarget.value);
          }}
          className={styles.searchInput}
        />
        <Button variant="outlined" onClick={clearFilters} className={styles.clearBtn}>
          Clear Filters
        </Button>
      </div>

      <div className={styles.grid}>
        <Select
          label="Project"
          value={searchParams.get('project') || 'All'}
          onChange={(e) => handleFilterChange('project', e.target.value)}
          options={projects.map(p => ({ label: p, value: p }))}
        />

        <Select
          label="Unit Type"
          value={searchParams.get('type') || 'All'}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          options={types.map(t => ({ label: t, value: t }))}
        />

        <Select
          label="Bedrooms"
          value={searchParams.get('bedrooms') || 'All'}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          options={[
            { label: 'All', value: 'All' },
            { label: '1+ Beds', value: '1' },
            { label: '2+ Beds', value: '2' },
            { label: '3+ Beds', value: '3' },
            { label: '4+ Beds', value: '4' },
          ]}
        />

        <Select
          label="Status"
          value={searchParams.get('status') || 'All'}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          options={statuses.map(s => ({ label: s, value: s }))}
        />

        <Select
          label="Sort By"
          value={searchParams.get('sort') || ''}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          options={[
            { label: 'Recommended', value: '' },
            { label: 'Price: Low to High', value: 'price_asc' },
            { label: 'Price: High to Low', value: 'price_desc' },
            { label: 'Newest', value: 'newest' },
          ]}
        />
      </div>
    </div>
  );
};
