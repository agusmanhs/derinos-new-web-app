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