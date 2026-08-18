import React from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './CTASection.module.css';

export const CTASection: React.FC = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.title}>Find a Place You&apos;ll Love to Call Home.</h2>
        <p className={styles.subtitle}>
          Connect with our advisors team to discuss available properties or schedule a private viewing of our model residences.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" size="lg">Schedule a Visit</Button>
          <Button variant="outlined" className={styles.outlineWhite} size="lg">Request Brochure</Button>
        </div>
      </div>
    </section>
  );
};
