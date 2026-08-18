import React from 'react';
import styles from './LoadingState.module.css';

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};
