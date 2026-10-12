'use client';
import React, { useState, useTransition } from 'react';
import { addGalleryImage, deleteGalleryImage, uploadImageAjaxAction } from '@/actions/adminLandingActions';
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