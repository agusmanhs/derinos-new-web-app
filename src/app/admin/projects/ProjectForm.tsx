'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { saveProjectAction } from '@/actions/adminProjectActions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styles from './ProjectForm.module.css';

interface Props {
  project?: Project; // If undefined, it's a create form
}

const initialState = {
  success: true,
  message: '',
};

export const ProjectForm: React.FC<Props> = ({ project }) => {
  const [state, formAction, isPending] = useActionState(saveProjectAction, initialState);

  return (
    <form className={styles.form} action={formAction}>
      {!state.success && (
        <div className={styles.errorAlert}>{state.message}</div>
      )}
      
      {/* Hidden ID field for Edit mode */}
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>
        <div className={styles.grid}>
          <Input 
            name="title" 
            label="Project Name *" 
            defaultValue={project?.title || ''} 
            required 
          />
          <Input 
            name="slug" 
            label="URL Slug *" 
            defaultValue={project?.slug || ''} 
            required 
            placeholder="e.g. greenwood-residence"
          />
          <Input 
            name="location" 
            label="Location *" 
            defaultValue={project?.location || ''} 
            required 
          />
          <div className={styles.formGroup}>
            <label className={styles.label}>Status *</label>
            <select name="status" className={styles.select} defaultValue={project?.status || 'Pre-Selling'} required>
              <option value="Pre-Selling">Pre-Selling</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Ready to Move">Ready to Move</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Details</h3>
        <div className={styles.grid}>
          <Input 
            name="startingPrice" 
            label="Starting Price" 
            defaultValue={project?.startingPrice || ''} 
            placeholder="e.g. $1.2M"
          />
          <Input 
            name="totalUnits" 
            label="Total Units" 
            type="number"
            defaultValue={project?.totalUnits?.toString() || ''} 
          />
          <Input 
            name="totalArea" 
            label="Total Area" 
            defaultValue={project?.totalArea || ''} 
            placeholder="e.g. 10 Hectares"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea 
            name="description" 
            className={styles.textarea} 
            defaultValue={project?.description || ''} 
            rows={5}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>SEO Metadata</h3>
        <div className={styles.grid}>
          <Input 
            name="metaTitle" 
            label="Meta Title" 
            defaultValue={project?.metaTitle || ''} 
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Meta Description</label>
          <textarea 
            name="metaDescription" 
            className={styles.textarea} 
            defaultValue={project?.metaDescription || ''} 
            rows={2}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/projects">
          <Button variant="outlined" type="button">Cancel</Button>
        </Link>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Project'}
        </Button>
      </div>
    </form>
  );
};
