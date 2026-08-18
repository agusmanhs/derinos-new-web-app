import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  borderRadius = 'var(--radius-none)' 
}) => {
  const customStyles: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
  };

  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={customStyles} 
      aria-hidden="true" 
    />
  );
};
