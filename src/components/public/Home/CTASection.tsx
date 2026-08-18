'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { LeadForm } from '@/components/public/LeadForm/LeadForm';
import styles from './CTASection.module.css';
import { Modal } from '@/components/ui/Modal/Modal';

export const CTASection: React.FC<{ projectOptions: {label: string, value: string}[] }> = ({ projectOptions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className={styles.cta}>
        <div className={styles.overlay} />
        <div className={styles.container}>
          <h2 className={styles.title}>Ready to find your dream home?</h2>
          <p className={styles.subtitle}>
            Connect with our property experts and discover a living experience tailored to you.
          </p>
          <div className={styles.buttonGroup}>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>Contact Us Now</Button>
            <Button variant="inverted">Browse Projects</Button>
          </div>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contact Sales">
        <LeadForm source="Homepage" projectOptions={projectOptions} onSuccess={() => {}} />
      </Modal>
    </>
  );
};
