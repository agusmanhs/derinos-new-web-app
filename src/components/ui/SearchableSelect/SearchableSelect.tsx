import React, { useState, useRef, useEffect } from 'react';
import styles from './SearchableSelect.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SearchableSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search...',
  error,
  required
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && (
        <label className={styles.label}>
          {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      
      <div 
        className={`${styles.selectContainer} ${error ? styles.errorBorder : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedValue}>
          {selectedOption ? selectedOption.label : <span className={styles.placeholder}>{placeholder}</span>}
        </div>
        <div className={styles.caret}>▼</div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <ul className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`${styles.option} ${opt.value === value ? styles.selected : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No results found</li>
            )}
          </ul>
        </div>
      )}

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
