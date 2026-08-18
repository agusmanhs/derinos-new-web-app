import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardProps>;
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
} = ({ children, className = '', ...props }) => {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = function CardHeader({ children, className = '', ...props }) {
  return <div className={`${styles.header} ${className}`} {...props}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '', ...props }) {
  return <div className={`${styles.body} ${className}`} {...props}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return <div className={`${styles.footer} ${className}`} {...props}>{children}</div>;
};
