'use client';
import React, { useState, useTransition } from 'react';
import { updateSiteSettings, uploadImageAjaxAction } from '@/actions/adminLandingActions';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export const GeneralSettingsClient = ({ initialSettings }: { initialSettings: any }) => {
  const [isPending, startTransition] = useTransition();
  const [heroImage, setHeroImage] = useState(initialSettings?.heroImage || '/mockups/hero_placeholder.jpg');
  const [introImageMain, setIntroImageMain] = useState(initialSettings?.introImageMain || '/mockups/gallery_1.jpg');
  const [introImageSecondary, setIntroImageSecondary] = useState(initialSettings?.introImageSecondary || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'introImageMain' | 'introImageSecondary') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingField(field);
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await uploadImageAjaxAction(formData);
    setUploadingField(null);
    
    if (res.success && res.url) {
      if (field === 'heroImage') setHeroImage(res.url);
      if (field === 'introImageMain') setIntroImageMain(res.url);
      if (field === 'introImageSecondary') setIntroImageSecondary(res.url);
    } else {
      alert('Upload failed: ' + (res.message || 'Unknown error'));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      heroTitle: formData.get('heroTitle'),
      heroSubtitle: formData.get('heroSubtitle'),
      heroImage,
      introTitle: formData.get('introTitle'),
      introDescription: formData.get('introDescription'),
      introImageMain,
      introImageSecondary,
      yearsExperience: formData.get('yearsExperience'),
      completedProjects: formData.get('completedProjects'),
      contactEmail: formData.get('contactEmail'),
      contactPhone: formData.get('contactPhone'),
      contactAddress: formData.get('contactAddress'),
    };
    
    startTransition(async () => {
      const res = await updateSiteSettings(data);
      if (res.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings: ' + res.message);
      }
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>General Landing Page Settings</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
        
        {/* HERO SECTION */}
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Hero Section</h2>
          <Input label="Hero Title" name="heroTitle" defaultValue={initialSettings?.heroTitle} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Hero Subtitle</label>
            <textarea name="heroSubtitle" defaultValue={initialSettings?.heroSubtitle} rows={3} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required></textarea>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Hero Background Image</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={heroImage} 
                onChange={(e) => setHeroImage(e.target.value)} 
                placeholder="Image URL or upload a file"
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }} 
              />
              <input 
                type="file" 
                id="heroImageUpload" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileUpload(e, 'heroImage')} 
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('heroImageUpload')?.click()}
                disabled={uploadingField === 'heroImage'}
              >
                {uploadingField === 'heroImage' ? 'Uploading...' : 'Upload File'}
              </Button>
            </div>
            {heroImage && (
              <div style={{ marginTop: '8px', width: '200px', height: '110px', position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroImage} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        {/* INTRO SECTION */}
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Intro Section ("Experience Modern Living")</h2>
          <Input label="Intro Title" name="introTitle" defaultValue={initialSettings?.introTitle} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Intro Description</label>
            <textarea name="introDescription" defaultValue={initialSettings?.introDescription} rows={4} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
            {/* Main Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Architecture Image (Main / Top)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={introImageMain} 
                  onChange={(e) => setIntroImageMain(e.target.value)} 
                  placeholder="URL or upload file"
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} 
                />
                <input 
                  type="file" 
                  id="introMainUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleFileUpload(e, 'introImageMain')} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('introMainUpload')?.click()}
                  disabled={uploadingField === 'introImageMain'}
                >
                  {uploadingField === 'introImageMain' ? '...' : 'Upload'}
                </Button>
              </div>
              {introImageMain && (
                <div style={{ width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={introImageMain} alt="Intro Main Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            {/* Secondary Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>Interior Image (Secondary / Bottom)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={introImageSecondary} 
                  onChange={(e) => setIntroImageSecondary(e.target.value)} 
                  placeholder="URL or upload file"
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} 
                />
                <input 
                  type="file" 
                  id="introSecUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => handleFileUpload(e, 'introImageSecondary')} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('introSecUpload')?.click()}
                  disabled={uploadingField === 'introImageSecondary'}
                >
                  {uploadingField === 'introImageSecondary' ? '...' : 'Upload'}
                </Button>
              </div>
              {introImageSecondary && (
                <div style={{ width: '100%', height: '140px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={introImageSecondary} alt="Intro Secondary Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
            <Input 
              label="Years Experience Statistic" 
              name="yearsExperience" 
              defaultValue={initialSettings?.yearsExperience || '15+'} 
              placeholder="e.g. 15+" 
            />
            <Input 
              label="Completed Projects Statistic" 
              name="completedProjects" 
              defaultValue={initialSettings?.completedProjects || '24'} 
              placeholder="e.g. 24" 
            />
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Contact Information</h2>
          <Input label="Email" name="contactEmail" defaultValue={initialSettings?.contactEmail} />
          <Input label="Phone" name="contactPhone" defaultValue={initialSettings?.contactPhone} />
          <Input label="Address" name="contactAddress" defaultValue={initialSettings?.contactAddress} />
        </div>

        <div>
          <Button variant="primary" type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Settings'}</Button>
        </div>
      </form>
    </div>
  );
};