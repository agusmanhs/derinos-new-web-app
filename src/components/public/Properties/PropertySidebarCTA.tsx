'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { LeadForm } from '@/components/public/LeadForm/LeadForm';
import styles from './PropertySidebarCTA.module.css';

interface PropertySidebarCTAProps {
  unitNumber: string;
  projectTitle: string;
  propertyType: string;
}

export const PropertySidebarCTA: React.FC<PropertySidebarCTAProps> = ({ unitNumber, projectTitle, propertyType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.stickyCTA}>
      <h3>Interested in Unit {unitNumber}?</h3>
      <p>Get in touch with our sales team to schedule a viewing or secure this unit.</p>
      
      <div className={styles.actionButtons}>
        <Button variant="primary" fullWidth onClick={() => setIsModalOpen(true)}>Schedule a Visit</Button>
        <Button variant="outlined" fullWidth onClick={() => setIsModalOpen(true)}>Contact Sales</Button>
      </div>

      <div className={styles.sidebarContact}>
        <span>Need help? Call us at</span>
        <strong>+1 234 567 890</strong>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contact Sales">
        <LeadForm 
          source="Property Detail" 
          defaultProject={projectTitle}
          defaultPropertyType={`Unit ${unitNumber} - ${propertyType}`}
          onSuccess={() => {}} 
        />
      </Modal>
    </div>
  );
};
