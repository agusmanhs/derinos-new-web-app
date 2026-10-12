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
  
  // Sales Deal State
  const [createDeal, setCreateDeal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Mortgage' | 'Cash' | 'Installment'>('Mortgage');
  const [contractPrice, setContractPrice] = useState<number | ''>(unit?.price || '');
  const [dealStatus, setDealStatus] = useState<'In Progress' | 'Completed'>('Completed');
  const [dealNotes, setDealNotes] = useState('');
  
  const [isPending, startTransition] = useTransition();

  // Reset form when modal opens or unit changes
  useEffect(() => {
    if (isOpen) {
      setSelectedStatusId(currentStatusId);
      setSelectedCustomerId(unit?.customerId || '');
      
      const latestBooking = unit?.bookings?.[0];
      setSelectedAgencyId((latestBooking && latestBooking.status !== 'Cancelled') ? (latestBooking.agencyId || '') : '');
      
      setBookingFee('');
      setContractPrice(unit?.price || '');
      setDealNotes('');

      const currentStatus = statuses.find(s => s.id === currentStatusId)?.name;
      if (currentStatus === 'Sudah Akad') {
        setCreateDeal(true);
        setPaymentMethod('Mortgage');
        setDealStatus('Completed');
      } else if (currentStatus === 'Cash/Lunas') {
        setCreateDeal(true);
        setPaymentMethod('Cash');
        setDealStatus('Completed');
      } else {
        setCreateDeal(false);
        setPaymentMethod('Mortgage');
        setDealStatus('In Progress');
      }
    }
  }, [isOpen, unit, currentStatusId, statuses]);

  if (!unit) return null;

  const selectedStatusName = statuses.find(s => s.id === selectedStatusId)?.name;
  const requiresCustomer = selectedStatusName && selectedStatusName !== 'Available' && selectedStatusName !== 'Unmapped / Other';
  const isClosingStatus = selectedStatusName === 'Sudah Akad' || selectedStatusName === 'Cash/Lunas';

  // Auto-adjust default deal settings when status changes
  const handleStatusSelect = (statusId: string) => {
    setSelectedStatusId(statusId);
    const statusName = statuses.find(s => s.id === statusId)?.name;
    if (statusName === 'Sudah Akad') {
      setCreateDeal(true);
      setPaymentMethod('Mortgage');
      setDealStatus('Completed');
    } else if (statusName === 'Cash/Lunas') {
      setCreateDeal(true);
      setPaymentMethod('Cash');
      setDealStatus('Completed');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresCustomer && !selectedCustomerId) {
      alert(`Customer is required for ${selectedStatusName} status.`);
      return;
    }

    startTransition(async () => {
      const dealData = (createDeal || isClosingStatus) ? {
        createDeal: true,
        paymentMethod,
        contractPrice: Number(contractPrice) || unit.price,
        dealStatus,
        notes: dealNotes || undefined
      } : undefined;

      const result = await updateUnitStatusFromSitePlan(
        unit.id,
        selectedStatusId,
        selectedStatusName || '',
        selectedCustomerId,
        selectedAgencyId,
        Number(bookingFee) || 0,
        undefined,
        dealData
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
          onChange={(e) => handleStatusSelect(e.target.value)}
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

            {/* Sales Deal Integration Section */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px',
              marginTop: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💼</span> Sales Deal (Transaksi Penjualan)
                </label>
                {!isClosingStatus && (
                  <label style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={createDeal} 
                      onChange={(e) => setCreateDeal(e.target.checked)} 
                    />
                    Catat sebagai Sales Deal
                  </label>
                )}
              </div>

              {(createDeal || isClosingStatus) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569', marginBottom: '4px', display: 'block' }}>
                      Skema Pembayaran
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {[
                        { id: 'Mortgage', label: '🏦 KPR' },
                        { id: 'Cash', label: '💵 Cash Keras' },
                        { id: 'Installment', label: '🗓️ Cash Bertahap' }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: paymentMethod === method.id ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                            background: paymentMethod === method.id ? '#eff6ff' : '#ffffff',
                            color: paymentMethod === method.id ? '#1d4ed8' : '#334155',
                            fontWeight: paymentMethod === method.id ? 600 : 500,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Nilai Kontrak / Harga Deal (Rp)"
                      type="number"
                      value={contractPrice}
                      onChange={(e) => setContractPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 500000000"
                    />
                    {contractPrice ? (
                      <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                        Rp {Number(contractPrice).toLocaleString('id-ID')}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569', marginBottom: '6px', display: 'block' }}>
                      Status Kesepakatan Deal
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {[
                        { id: 'Completed', label: '🟢 Completed', desc: 'Selesai Akad / Lunas' },
                        { id: 'In Progress', label: '🟡 In Progress', desc: 'Menunggu Akad' }
                      ].map(item => {
                        const isActive = dealStatus === item.id;
                        const activeBorder = item.id === 'Completed' ? '#059669' : '#d97706';
                        const activeBg = item.id === 'Completed' ? '#ecfdf5' : '#fffbeb';
                        const activeColor = item.id === 'Completed' ? '#065f46' : '#92400e';

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setDealStatus(item.id as any)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '6px',
                              border: isActive ? `2px solid ${activeBorder}` : '1px solid #cbd5e1',
                              background: isActive ? activeBg : '#ffffff',
                              color: isActive ? activeColor : '#334155',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '2px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{item.label}</span>
                            <span style={{ fontSize: '0.7rem', color: isActive ? activeColor : '#64748b' }}>{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569', marginBottom: '4px', display: 'block' }}>
                      Catatan Kesepakatan Khusus (Bonus, Kelebihan Tanah, dll):
                    </label>
                    <textarea
                      value={dealNotes}
                      onChange={(e) => setDealNotes(e.target.value)}
                      rows={2}
                      placeholder="Contoh: Gratis kanopi, AC 1 PK, kelebihan tanah 15 m²..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        background: '#ffffff',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <Button variant="outlined" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Status'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
