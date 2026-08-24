'use client';

import React, { useState, useTransition } from 'react';
import { PropertyStatus } from '@/types/project';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { createStatusAction, updateStatusAction, deleteStatusAction } from '@/actions/adminStatusActions';
import styles from './StatusListClient.module.css';

interface Props {
  initialStatuses: PropertyStatus[];
}

export const StatusListClient: React.FC<Props> = ({ initialStatuses }) => {
  const [statuses, setStatuses] = useState<PropertyStatus[]>(initialStatuses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<PropertyStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSaveStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      colorHex: formData.get('colorHex') as string,
      order: parseInt(formData.get('order') as string) || 0,
    };

    startTransition(async () => {
      try {
        if (editingStatus) {
          const updated = await updateStatusAction(editingStatus.id, data);
          setStatuses(statuses.map(s => s.id === updated.id ? updated : s));
        } else {
          const created = await createStatusAction(data);
          setStatuses([...statuses, created]);
        }
        setIsModalOpen(false);
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  const handleDeleteStatus = async (statusId: string) => {
    if (!confirm('Are you sure you want to delete this status? Units using this status might lose their visual representation.')) return;
    
    startTransition(async () => {
      try {
        await deleteStatusAction(statusId);
        setStatuses(statuses.filter(s => s.id !== statusId));
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Master Unit Statuses</h3>
          <Button variant="primary" onClick={() => {
            setEditingStatus(null);
            setIsModalOpen(true);
          }}>
            + Add Status
          </Button>
        </div>
        
        <table className={styles.table} style={{ marginTop: '16px' }}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Status Name</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
                  No statuses created yet.
                </td>
              </tr>
            ) : (
              statuses.sort((a, b) => (a.order || 0) - (b.order || 0)).map(status => (
                <tr key={status.id}>
                  <td>{status.order}</td>
                  <td><strong>{status.name}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', backgroundColor: status.colorHex, borderRadius: '4px', border: '1px solid #E5E7EB' }}></div>
                      <span>{status.colorHex}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditingStatus(status); setIsModalOpen(true); }} className={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDeleteStatus(status.id)} className={styles.deleteBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStatus ? "Edit Status" : "Add New Status"}>
        <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <Input 
            label="Status Name"
            id="name" 
            name="name" 
            defaultValue={editingStatus?.name} 
            required 
            placeholder="e.g. Booking Fee, Handover" 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="colorHex" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Color (Hex)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="color" id="colorHex" name="colorHex" defaultValue={editingStatus?.colorHex || '#34D399'} required style={{ width: '48px', height: '42px', padding: '0', cursor: 'pointer', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              <input type="text" defaultValue={editingStatus?.colorHex || '#34D399'} readOnly style={{ flex: 1, backgroundColor: '#F3F4F6', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '8px 12px' }} />
            </div>
          </div>
          
          <Input 
            label="Sort Order"
            type="number" 
            id="order" 
            name="order" 
            defaultValue={editingStatus?.order || 0} 
            required 
          />
          <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-12px' }}>Lower numbers appear first in the legend.</small>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isPending}>
              {editingStatus ? 'Save Changes' : 'Create Status'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
