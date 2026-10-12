'use client';
import React, { useState, useTransition } from 'react';
import { updateSiteSettings } from '@/actions/adminLandingActions';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

export const GeneralSettingsClient = ({ initialSettings }: { initialSettings: any }) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      heroTitle: formData.get('heroTitle'),
      heroSubtitle: formData.get('heroSubtitle'),
      introTitle: formData.get('introTitle'),
      introDescription: formData.get('introDescription'),
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
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Hero Section</h2>
          <Input label="Hero Title" name="heroTitle" defaultValue={initialSettings.heroTitle} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Hero Subtitle</label>
            <textarea name="heroSubtitle" defaultValue={initialSettings.heroSubtitle} rows={3} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required></textarea>
          </div>
          <p style={{ fontSize: '12px', color: '#666' }}>Note: To update the Hero Image, you can manually replace `/public/mockups/hero_placeholder.jpg` for now, or we can build an image uploader later.</p>
        </div>

        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Intro Section</h2>
          <Input label="Intro Title" name="introTitle" defaultValue={initialSettings.introTitle} required />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Intro Description</label>
            <textarea name="introDescription" defaultValue={initialSettings.introDescription} rows={4} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} required></textarea>
          </div>
        </div>

        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Contact Information</h2>
          <Input label="Email" name="contactEmail" defaultValue={initialSettings.contactEmail} />
          <Input label="Phone" name="contactPhone" defaultValue={initialSettings.contactPhone} />
          <Input label="Address" name="contactAddress" defaultValue={initialSettings.contactAddress} />
        </div>

        <div>
          <Button variant="primary" type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Settings'}</Button>
        </div>
      </form>
    </div>
  );
};