'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';
import { Select } from '@/components/ui/Select/Select';
import { SearchableSelect } from '@/components/ui/SearchableSelect/SearchableSelect';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { updateUnitStatusFromSitePlan } from '@/actions/unitStatusActions';

interface UpdateUnitStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  currentStatusId: string;
  statuses: any[];
  customers: any[];
  agencies: any[];
  onSuccess: () => void;
}

export const UpdateUnitStatusModal: React.FC<UpdateUnitStatusModalProps> = ({
  isOpen,
  onClose,
  unit,
  currentStatusId,
  statuses,
  customers,
  agencies,
  onSuccess
}) => {
  const [selectedStatusId, setSelectedStatusId] = useState(currentStatusId);
  const [selectedCustomerId, setSelectedCustomerId] = useState(unit?.customerId || '');
  const [selectedAgencyId, setSelectedAgencyId] = useState(() => {
    const latestBooking = unit?.bookings?.[0];
    return (latestBooking && latestBooking.status !== 'Cancelled') ? (latestBooking.agencyId || '') : '';
  });
  const [bookingFee, setBookingFee] = useState<number | ''>('');
  
  const [isPending, startTransition] = useTransition();

  // Reset form when modal opens or unit changes
  useEffect(() => {
    if (isOpen) {
      setSelectedStatusId(currentStatusId);
      setSelectedCustomerId(unit?.customerId || '');
      
      const latestBooking = unit?.bookings?.[0];
      setSelectedAgencyId((latestBooking && latestBooking.status !== 'Cancelled') ? (latestBooking.agencyId || '') : '');
      
      setBookingFee('');
    }
  }, [isOpen, unit, currentStatusId]);

  if (!unit) return null;

  const selectedStatusName = statuses.find(s => s.id === selectedStatusId)?.name;
  const requiresCustomer = selectedStatusName && selectedStatusName !== 'Available' && selectedStatusName !== 'Unmapped / Other';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresCustomer && !selectedCustomerId) {
      alert(`Customer is required for ${selectedStatusName} status.`);
      return;
    }

    startTransition(async () => {
      const result = await updateUnitStatusFromSitePlan(
        unit.id,
        selectedStatusId,
        selectedStatusName || '',
        selectedCustomerId,
        selectedAgencyId,
        Number(bookingFee) || 0
      );

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Status - Unit ${unit.unitNumber}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <Select
          label="Unit Status"
          value={selectedStatusId}
          onChange={(e) => setSelectedStatusId(e.target.value)}
          required
          options={[
            { label: 'Select Status', value: '' },
            ...statuses.map(s => ({ label: s.name, value: s.id }))
          ]}
        />

        {requiresCustomer && (
          <>
            <SearchableSelect
              label="Customer (Buyer)"
              value={selectedCustomerId}
              onChange={setSelectedCustomerId}
              required
              placeholder="Search customer..."
              options={customers.map(c => ({ label: c.name, value: c.id }))}
            />
            
            <SearchableSelect
              label="Marketing / Agency"
              value={selectedAgencyId}
              onChange={setSelectedAgencyId}
              placeholder="Search agency (optional)..."
              options={[
                { label: '-- No Agency (Direct/In-house) --', value: '' },
                ...agencies.map(a => ({ label: a.name, value: a.id }))
              ]}
            />

            <Input
              label="Booking Fee / NUP (Rp)"
              type="number"
              value={bookingFee}
              onChange={(e) => setBookingFee(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 5000000"
            />
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isPending}>
            Save Status
          </Button>
        </div>
      </form>
    </Modal>
  );
};
