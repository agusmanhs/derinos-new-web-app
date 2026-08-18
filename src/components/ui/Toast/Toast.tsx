'use client';

import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span>{message}</span>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close Toast">
        &times;
      </button>
    </div>
  );
};
