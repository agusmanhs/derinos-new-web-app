import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'neutral' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', children, ...props }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
