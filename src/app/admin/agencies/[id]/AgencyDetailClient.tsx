'use client';

import React, { useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button/Button';
import { updateCommissionAction } from '@/actions/adminMarketingActions';
import styles from '../../customers/page.module.css'; // Reusing modal styles

interface Props {
  agency: any; // Using any for simplicity as it includes nested commissions, bookings, sales
}

export const AgencyDetailClient: React.FC<Props> = ({ agency }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (commission: any) => {
    setEditingCommission(commission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCommission(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get('amount') as string);
    const status = formData.get('status') as string;
    const paymentNotes = formData.get('paymentNotes') as string;
    
    try {
      await updateCommissionAction(editingCommission.id, amount, status, paymentNotes);
      handleCloseModal();
    } catch (err: any) {
      alert("Error updating commission: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Date',
      accessor: (row: any) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Transaction',
      accessor: (row: any) => (
        <div>
          {row.booking && (
            <div>
              <strong>Booking:</strong> {row.booking.unitNumber.toUpperCase()} ({row.booking.projectTitle})
            </div>
          )}
          {row.sale && (
            <div>
              <strong>Sale:</strong> {row.sale.unitNumber.toUpperCase()} ({row.sale.projectTitle})
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Commission Amount',
      accessor: (row: any) => row.amount ? `Rp ${row.amount.toLocaleString('id-ID')}` : '-'
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: row.status === 'Paid' ? '#dcfce7' : '#fef9c3',
          color: row.status === 'Paid' ? '#166534' : '#854d0e'
        }}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Payment Date',
      accessor: (row: any) => row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : '-'
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <Button variant="outlined" onClick={() => handleOpenModal(row)}>
          {row.status === 'Paid' ? 'Edit Details' : 'Set Amount & Pay'}
        </Button>
      )
    }
  ];

  return (
    <div>
      <h3 style={{ marginBottom: '16px' }}>Commissions History</h3>
      <AdminTable 
        columns={columns} 
        data={agency.commissions || []} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No commissions found for this agency."
      />

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Update Commission</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Commission Amount (Rp) *</label>
                  <input 
                    type="number" 
                    name="amount" 
                    defaultValue={editingCommission?.amount || ''} 
                    required 
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select name="status" defaultValue={editingCommission?.status || 'Pending'} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Payment Notes (e.g. transfer ref)</label>
                  <input type="text" name="paymentNotes" defaultValue={editingCommission?.paymentNotes || ''} />
                </div>
              </div>
              <div className={styles.formActions} style={{ marginTop: '24px' }}>
                <Button variant="outlined" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Commission'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
