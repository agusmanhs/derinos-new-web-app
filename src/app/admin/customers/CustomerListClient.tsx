'use client';

import React, { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { Button } from '@/components/ui/Button/Button';
import { Customer } from '../../../../generated/prisma/client';
import { IconEdit, IconTrash } from '@/components/ui/Icon/AdminIcons';
import { createCustomerAction, updateCustomerAction, deleteCustomerAction } from '@/actions/adminCustomerActions';
import styles from './page.module.css';

interface Props {
  customers: any[]; // Extended customer with properties, bookings, sales
}

export const CustomerListClient: React.FC<Props> = ({ customers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div>
      <AdminPageHeader 
        title="Customers" 
        description="Manage your master customer database."
        action={
          <Button variant="primary" onClick={() => handleOpenModal()}>+ New Customer</Button>
        }
      />

      <div className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, email, or phone..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>NAME</th>
                <th>CONTACT</th>
                <th>ADDRESS</th>
                <th>ASSETS/BOOKINGS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.name}</strong></td>
                    <td>
                      <div>{row.phone || '-'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.email || '-'}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.address || '-'}
                      </div>
                    </td>
                    <td>
                      <span style={{ marginRight: 12 }}>🏠 {row.properties?.length || 0}</span>
                      <span>📝 {row.bookings?.length || 0}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionIcons}>
                        <button className={styles.iconButton} onClick={() => handleOpenModal(row)} title="Edit Customer">
                          <IconEdit />
                        </button>
                        <button className={styles.iconButton} onClick={() => handleDelete(row.id)} title="Delete Customer">
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
