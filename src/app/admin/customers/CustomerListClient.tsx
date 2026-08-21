'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button/Button';
import { Customer } from '../../../../generated/prisma/client';
import { createCustomerAction, updateCustomerAction, deleteCustomerAction } from '@/actions/adminCustomerActions';
import styles from './page.module.css';

interface Props {
  customers: any[]; // Extended customer with properties, bookings, sales
}

export const CustomerListClient: React.FC<Props> = ({ customers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
    } else {
      setEditingCustomer(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer? This may fail if they have associated records.')) {
      try {
        await deleteCustomerAction(id);
      } catch (err: any) {
        alert("Failed to delete: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (editingCustomer) {
        await updateCustomerAction(editingCustomer.id, formData);
      } else {
        await createCustomerAction(formData);
      }
      handleCloseModal();
    } catch (err: any) {
      alert("Error saving customer: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof Customer
    },
    {
      header: 'Contact',
      accessor: (row: Customer) => (
        <div>
          <div>{row.phone || '-'}</div>
          <div style={{ fontSize: '0.85em', color: '#666' }}>{row.email || '-'}</div>
        </div>
      )
    },
    {
      header: 'Assets/Bookings',
      accessor: (row: any) => (
        <div>
          <span style={{ marginRight: 8 }}>🏠 {row.properties?.length || 0}</span>
          <span>📝 {row.bookings?.length || 0}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Customer) => (
        <div className={styles.actionButtons}>
          <Button variant="outlined" onClick={() => handleOpenModal(row)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Customers" 
        description="Manage your master customer database."
        action={
          <Button variant="primary" onClick={() => handleOpenModal()}>+ New Customer</Button>
        }
      />

      <AdminTable 
        columns={columns} 
        data={customers} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No customers found."
      />

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingCustomer ? 'Edit Customer' : 'New Customer'}</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name *</label>
                  <input type="text" name="name" defaultValue={editingCustomer?.name || ''} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" name="email" defaultValue={editingCustomer?.email || ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="text" name="phone" defaultValue={editingCustomer?.phone || ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input type="text" name="address" defaultValue={editingCustomer?.address || ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>KTP Number</label>
                  <input type="text" name="ktpNumber" defaultValue={editingCustomer?.ktpNumber || ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>NPWP</label>
                  <input type="text" name="npwp" defaultValue={editingCustomer?.npwp || ''} />
                </div>
              </div>
              <div className={styles.formActions}>
                <Button variant="outlined" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
