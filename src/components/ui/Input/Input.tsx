import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputContainer}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            className={`${styles.input} ${error ? styles.inputError : ''} ${icon ? styles.hasIcon : ''}`}
            {...props}
          />
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
