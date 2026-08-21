'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { PropertyUnit, Project } from '@/types/project';
import { savePropertyAction } from '@/actions/adminPropertyActions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styles from './PropertyForm.module.css';

interface Props {
  property?: PropertyUnit;
  projects: Project[]; // For the dropdown
  customers: any[]; // For the customer dropdown
}

const initialState = {
  success: true,
  message: '',
};

export const PropertyForm: React.FC<Props> = ({ property, projects, customers }) => {
  const [state, formAction, isPending] = useActionState(savePropertyAction, initialState);

  return (
    <form className={styles.form} action={formAction}>
      {!state.success && (
        <div className={styles.errorAlert}>{state.message}</div>
      )}
      
      {property?.id && <input type="hidden" name="id" value={property.id} />}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Unit Information</h3>
        <div className={styles.grid}>
          <Input 
            name="unitNumber" 
            label="Unit Number *" 
            defaultValue={property?.unitNumber || ''} 
            required 
            placeholder="e.g. B-12"
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Project *</label>
            <select name="projectId" className={styles.select} defaultValue={property?.projectId || ''} required>
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <Input 
            name="typeName" 
            label="House Type *" 
            defaultValue={property?.typeName || ''} 
            required 
            placeholder="e.g. Type 45"
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Status *</label>
            <select name="status" className={styles.select} defaultValue={property?.status || 'Available'} required>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Customer / Buyer</label>
            <select name="customerId" className={styles.select} defaultValue={property?.customerId || ''}>
              <option value="">-- No Customer Assigned --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Specifications & Pricing</h3>
        <div className={styles.grid}>
          <Input 
            name="price" 
            label="Price (USD) *" 
            type="number"
            defaultValue={property?.price?.toString() || ''} 
            required 
          />
          <Input 
            name="landSize" 
            label="Land Size (sqm)" 
            type="number"
            defaultValue={property?.landSize?.toString() || ''} 
          />
          <Input 
            name="buildingSize" 
            label="Building Size (sqm)" 
            type="number"
            defaultValue={property?.buildingSize?.toString() || ''} 
          />
          <Input 
            name="bedrooms" 
            label="Bedrooms" 
            type="number"
            defaultValue={property?.bedrooms?.toString() || ''} 
          />
          <Input 
            name="bathrooms" 
            label="Bathrooms" 
            type="number"
            defaultValue={property?.bathrooms?.toString() || ''} 
          />
          <Input 
            name="carports" 
            label="Carports" 
            type="number"
            defaultValue={property?.carports?.toString() || ''} 
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/properties">
          <Button variant="outlined" type="button">Cancel</Button>
        </Link>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Unit'}
        </Button>
      </div>
    </form>
  );
};
