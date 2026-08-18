import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, ...props }, ref) => {
    return (
      <div className={`${styles.wrapper} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          ref={ref}
          className={`${styles.select} ${error ? styles.selectError : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
