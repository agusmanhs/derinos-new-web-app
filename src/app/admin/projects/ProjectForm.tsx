'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import { saveProjectAction } from '@/actions/adminProjectActions';
import { uploadImageAjaxAction } from '@/actions/adminLandingActions';
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
  const [heroImage, setHeroImage] = useState(project?.heroImage || '/mockups/hero_placeholder.jpg');
  const [uploading, setUploading] = useState(false);

  const handleUploadHero = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadImageAjaxAction(formData);
    setUploading(false);
    if (res.success && res.url) {
      setHeroImage(res.url);
    } else {
      alert('Upload failed: ' + (res.message || 'Unknown error'));
    }
  };

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
        <h3 className={styles.sectionTitle}>Project Media & Showcase</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label className={styles.label}>Hero / Cover Image</label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input 
              type="text" 
              name="heroImage" 
              value={heroImage} 
              onChange={(e) => setHeroImage(e.target.value)} 
              placeholder="Image URL or upload a file"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} 
            />
            <input 
              type="file" 
              id="projectHeroUpload" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleUploadHero} 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('projectHeroUpload')?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
          {heroImage && (
            <div style={{ marginTop: '8px', width: '240px', height: '140px', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="Project Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input 
            type="checkbox" 
            name="featured" 
            id="featuredCheckbox" 
            defaultChecked={project?.featured || false} 
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="featuredCheckbox" style={{ fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
            Featured on Homepage ("Discover Our Properties")
          </label>
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
