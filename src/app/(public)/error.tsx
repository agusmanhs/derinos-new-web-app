'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Something went wrong!</h2>
      <p className={styles.subtitle}>We encountered an unexpected error while loading this page.</p>
      <Button variant="primary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
