'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button/Button';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={styles.pagination}>
      <Button 
        variant="outlined" 
        disabled={currentPage === 1}
        onClick={() => navigate(currentPage - 1)}
      >
        Previous
      </Button>
      
      <div className={styles.pages}>
        {pages.map(page => (
          <button
            key={page}
            className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
            onClick={() => navigate(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <Button 
        variant="outlined" 
        disabled={currentPage === totalPages}
        onClick={() => navigate(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};
