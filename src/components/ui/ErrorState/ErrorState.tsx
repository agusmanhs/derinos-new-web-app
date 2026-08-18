import React from 'react';
import styles from './ErrorState.module.css';
import { Button } from '../Button/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while trying to process your request.", 
  onRetry 
}) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
