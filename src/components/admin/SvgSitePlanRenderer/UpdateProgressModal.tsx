'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { updateConstructionProgressAction } from '@/actions/unitStatusActions';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  onSuccess: () => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  unit,
  onSuccess
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen && unit) {
      setProgress(unit.constructionProgress || 0);
      setNotes('');
      setFiles(null);
    }
  }, [isOpen, unit]);

  if (!unit) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (progress < 0 || progress > 100) {
      alert("Progress must be between 0 and 100");
      return;
    }

    const formData = new FormData();
    formData.append('propertyUnitId', unit.id);
    formData.append('progress', progress.toString());
    if (notes) formData.append('notes', notes);
    
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('photos', file);
      });
    }

    startTransition(async () => {
      const result = await updateConstructionProgressAction(formData);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        alert(result.message || 'Failed to update progress');
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Progress - Unit ${unit.unitNumber}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <Input
          label="Construction Progress (%)"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          required
        />
        
        <div style={{
          height: '24px',
          backgroundColor: '#e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          marginTop: '4px'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: progress === 100 ? '#10b981' : '#3b82f6',
            width: `${progress}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
          {progress}%
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
            Documentation Photos
          </label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            style={{
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#f9fafb',
              fontSize: '0.875rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
            Notes / Keterangan
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Tambahkan catatan perkembangan lapangan..."
            style={{
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              resize: 'vertical',
              fontSize: '0.875rem',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isPending}>
            Save Progress
          </Button>
        </div>
      </form>
    </Modal>
  );
};
