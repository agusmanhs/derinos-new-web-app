'use client';

import React, { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { Select } from '@/components/ui/Select/Select';
import { submitLead } from '@/actions/leadActions';
import styles from './LeadForm.module.css';

export interface LeadFormProps {
  source: 'Homepage' | 'Project Detail' | 'Property Detail' | 'Contact Page';
  defaultProject?: string;
  defaultPropertyType?: string;
  onSuccess?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ 
  source, 
  defaultProject = '', 
  defaultPropertyType = '',
  onSuccess
}) => {
  const searchParams = useSearchParams();
  const campaign = searchParams.get('utm_campaign') || searchParams.get('campaign') || '';

  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    formData.append('source', source);
    formData.append('campaign', campaign);

    startTransition(async () => {
      const result = await submitLead(null, formData);
      if (result.success) {
        setSuccessMsg(result.message || 'Success');
        (e.target as HTMLFormElement).reset();
        if (onSuccess) onSuccess();
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        } else {
          setErrorMsg(result.message || 'Something went wrong.');
        }
      }
    });
  };

  if (successMsg) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✓</div>
        <h3>Request Received</h3>
        <p>{successMsg}</p>
        <Button variant="outlined" onClick={() => setSuccessMsg('')}>Send Another Request</Button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {errorMsg && <div className={styles.globalError}>{errorMsg}</div>}

      <div className={styles.row}>
        <Input 
          name="name" 
          label="Full Name *" 
          placeholder="John Doe" 
          error={fieldErrors.name} 
          required 
        />
        <Input 
          name="phone" 
          label="Phone Number *" 
          type="tel" 
          placeholder="+1 234 567 890" 
          error={fieldErrors.phone} 
          required 
        />
      </div>

      <Input 
        name="email" 
        label="Email Address *" 
        type="email" 
        placeholder="john@example.com" 
        error={fieldErrors.email} 
        required 
      />

      <div className={styles.row}>
        <Select 
          name="project" 
          label="Project of Interest" 
          defaultValue={defaultProject}
          options={[
            { label: 'Select Project', value: '' },
            { label: 'Greenwood Residence', value: 'Greenwood Residence' },
            { label: 'The Valley Estate', value: 'The Valley Estate' },
            { label: 'Oasis Townhomes', value: 'Oasis Townhomes' },
          ]}
        />
        <Input 
          name="propertyType" 
          label="Property Type / Unit" 
          placeholder="e.g. Type 36, Unit A-12"
          defaultValue={defaultPropertyType}
        />
      </div>

      <Select 
        name="budget" 
        label="Estimated Budget" 
        options={[
          { label: 'Not Sure', value: 'Not Sure' },
          { label: 'Under $1M', value: 'Under 1M' },
          { label: '$1M - $2M', value: '1M-2M' },
          { label: '$2M - $5M', value: '2M-5M' },
          { label: 'Above $5M', value: 'Above 5M' },
        ]}
      />

      <div className={styles.textareaWrapper}>
        <label className={styles.label}>Message</label>
        <textarea 
          name="message" 
          className={styles.textarea} 
          placeholder="How can we help you?"
          rows={4}
        />
      </div>

      <Button 
        type="submit" 
        variant="primary" 
        fullWidth 
        disabled={isPending}
        className={styles.submitBtn}
      >
        {isPending ? 'Sending...' : 'Submit Request'}
      </Button>
      
      <p className={styles.disclaimer}>
        By submitting this form, you agree to our Privacy Policy.
      </p>
    </form>
  );
};
