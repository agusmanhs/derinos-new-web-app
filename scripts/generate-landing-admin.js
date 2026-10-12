const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

const files = {
  // 1. Actions
  'actions/adminLandingActions.ts': `
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return settings;
}

export async function updateSiteSettings(data: any) {
  try {
    const settings = await getSiteSettings();
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data
    });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getMasterFacilities() {
  return prisma.masterFacility.findMany({ orderBy: { order: 'asc' } });
}

export async function upsertMasterFacility(data: any) {
  try {
    if (data.id) {
      await prisma.masterFacility.update({ where: { id: data.id }, data });
    } else {
      await prisma.masterFacility.create({ data });
    }
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteMasterFacility(id: string) {
  try {
    await prisma.masterFacility.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function getMasterGallery() {
  return prisma.masterGallery.findMany({ orderBy: { order: 'asc' } });
}

export async function addGalleryImage(data: any) {
  try {
    await prisma.masterGallery.create({ data });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const img = await prisma.masterGallery.findUnique({ where: { id } });
    if (img && img.imageUrl.startsWith('/uploads/')) {
      // Optional: Delete physical file
      const filePath = path.join(process.cwd(), 'public', img.imageUrl);
      await fs.unlink(filePath).catch(() => {});
    }
    await prisma.masterGallery.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
`,

  // 2. Admin Landing Page Layout/Redirect
  'app/admin/landing/layout.tsx': `
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landing Page Settings - Admin',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '24px' }}>
      {children}
    </div>
  );
}
`,
  'app/admin/landing/page.tsx': `
import { redirect } from 'next/navigation';
export default function LandingPage() {
  redirect('/admin/landing/general');
}
`,

  // 3. General Settings
  'app/admin/landing/general/page.tsx': `
import { getSiteSettings } from '@/actions/adminLandingActions';
import { GeneralSettingsClient } from './GeneralSettingsClient';

export default async function GeneralSettingsPage() {
  const settings = await getSiteSettings();
  return <GeneralSettingsClient initialSettings={settings} />;
}
`,
  'app/admin/landing/general/GeneralSettingsClient.tsx': `
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
          <p style={{ fontSize: '12px', color: '#666' }}>Note: To update the Hero Image, you can manually replace \`/public/mockups/hero_placeholder.jpg\` for now, or we can build an image uploader later.</p>
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
`,

  // 4. Facilities
  'app/admin/landing/facilities/page.tsx': `
import { getMasterFacilities } from '@/actions/adminLandingActions';
import { FacilitiesClient } from './FacilitiesClient';

export default async function FacilitiesPage() {
  const facilities = await getMasterFacilities();
  return <FacilitiesClient initialFacilities={facilities} />;
}
`,
  'app/admin/landing/facilities/FacilitiesClient.tsx': `
'use client';
import React, { useState, useTransition } from 'react';
import { upsertMasterFacility, deleteMasterFacility } from '@/actions/adminLandingActions';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';

export const FacilitiesClient = ({ initialFacilities }: { initialFacilities: any[] }) => {
  const [facilities, setFacilities] = useState(initialFacilities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingItem?.id,
      name: formData.get('name'),
      description: formData.get('description'),
      iconSvg: formData.get('iconSvg'),
      order: parseInt(formData.get('order') as string) || 0,
      isActive: true,
    };
    
    startTransition(async () => {
      const res = await upsertMasterFacility(data);
      if (res.success) {
        setIsModalOpen(false);
        window.location.reload(); // Simple refresh for now
      } else {
        alert(res.message);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this facility?')) return;
    startTransition(async () => {
      await deleteMasterFacility(id);
      window.location.reload();
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Master Facilities</h1>
        <Button variant="primary" onClick={() => openModal()}>+ Add Facility</Button>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {facilities.map(fac => (
          <div key={fac.id} style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '40px', height: '40px', color: '#059669' }} dangerouslySetInnerHTML={{ __html: fac.iconSvg || '' }} />
              <div>
                <button onClick={() => openModal(fac)} style={{ color: '#2563EB', marginRight: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(fac.id)} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '12px' }}>{fac.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>{fac.description}</p>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '12px' }}>Order: {fac.order}</p>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Edit Facility" : "Add Facility"}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <Input label="Name" name="name" defaultValue={editingItem?.name} required />
          <Input label="Description" name="description" defaultValue={editingItem?.description} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500 }}>Icon (SVG Code)</label>
            <textarea name="iconSvg" defaultValue={editingItem?.iconSvg} rows={4} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="<svg>...</svg>"></textarea>
          </div>
          <Input label="Display Order" name="order" type="number" defaultValue={editingItem?.order ?? 0} />
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
`,

  // 5. Gallery
  'app/admin/landing/gallery/page.tsx': `
import { getMasterGallery } from '@/actions/adminLandingActions';
import { GalleryClient } from './GalleryClient';

export default async function GalleryPage() {
  const images = await getMasterGallery();
  return <GalleryClient initialImages={images} />;
}
`,
  'app/admin/landing/gallery/GalleryClient.tsx': `
'use client';
import React, { useState, useTransition } from 'react';
import { addGalleryImage, deleteGalleryImage } from '@/actions/adminLandingActions';
import { uploadImageAjaxAction } from '@/actions/adminPropertyActions';
import { Button } from '@/components/ui/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import Image from 'next/image';

export const GalleryClient = ({ initialImages }: { initialImages: any[] }) => {
  const [images, setImages] = useState(initialImages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await uploadImageAjaxAction(formData);
    setUploading(false);
    
    if (res.success && res.url) {
      startTransition(async () => {
        await addGalleryImage({ title: file.name, imageUrl: res.url, order: images.length + 1 });
        window.location.reload();
      });
    } else {
      alert('Upload failed: ' + res.message);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this image?')) return;
    startTransition(async () => {
      await deleteGalleryImage(id);
      window.location.reload();
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Master Gallery</h1>
        <div>
          <input type="file" id="galleryUpload" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          <Button variant="primary" onClick={() => document.getElementById('galleryUpload')?.click()} disabled={uploading}>
            {uploading ? 'Uploading...' : '+ Upload Image'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {images.map(img => (
          <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '200px' }}>
            <Image src={img.imageUrl} alt={img.title || 'Gallery Image'} fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(rgba(0,0,0,0.7), transparent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'white', fontSize: '14px', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{img.title}</span>
              <button onClick={() => handleDelete(img.id)} style={{ color: 'white', background: 'rgba(220, 38, 38, 0.8)', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p style={{ color: '#666' }}>No gallery images uploaded yet.</p>}
      </div>
    </div>
  );
};
`
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n', 'utf8');
  console.log('Created:', relPath);
}
