import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { Button } from '@/components/ui/Button/Button';
import Image from 'next/image';

export default function AdminContentPage() {
  const mockImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2070&auto=format&fit=crop'
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Media & Content" 
        description="Manage images, brochures, and masterplan assets."
        action={
          <Button variant="primary">Upload Media</Button>
        }
      />

      <div style={{ background: 'white', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>Asset Gallery</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {mockImages.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', height: '150px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
              <Image src={src} alt={`Asset ${idx}`} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Asset_{idx+1}.jpg</span>
                <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
