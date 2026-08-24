'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button/Button';
import { saveAgencyAction, deleteAgencyAction } from '@/actions/adminMarketingActions';
import { MarketingAgency } from '../../../../generated/prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../customers/page.module.css'; // Reusing customer styles

interface ExtendedAgency extends MarketingAgency {
  _count: {
    bookings: number;
    sales: number;
  };
}

interface Props {
  agencies: ExtendedAgency[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export const AgencyListClient: React.FC<Props> = ({ agencies, pagination }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<ExtendedAgency | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (agency?: ExtendedAgency) => {
    setEditingAgency(agency || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAgency(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this agency?')) {
      try {
        await deleteAgencyAction(id);
      } catch (err: any) {
        alert("Failed to delete: " + err.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (editingAgency) {
      formData.append('id', editingAgency.id);
    }
    
    try {
      await saveAgencyAction(formData);
      handleCloseModal();
    } catch (err: any) {
      alert("Error saving agency: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin/agencies?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/agencies?${params.toString()}`);
  };

  const columns = [
    {
      header: 'Agency Name',
      accessor: (row: ExtendedAgency) => (
        <Link href={`/admin/agencies/${row.id}`} style={{ fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
          {row.name}
        </Link>
      )
    },
    {
      header: 'PIC / Contact',
      accessor: (row: ExtendedAgency) => (
        <div>
          <div>{row.picName || '-'}</div>
          <div style={{ fontSize: '0.85em', color: '#666' }}>{row.phone || '-'}</div>
        </div>
      )
    },
    {
      header: 'Performance',
      accessor: (row: ExtendedAgency) => (
        <div>
          <span style={{ marginRight: 8 }}>📝 Bookings: {row._count?.bookings || 0}</span>
          <span>💰 Sales: {row._count?.sales || 0}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: ExtendedAgency) => (
        <div className={styles.actionButtons}>
          <Link href={`/admin/agencies/${row.id}`}>
            <Button variant="outlined">View Detail</Button>
          </Link>
          <Button variant="outlined" onClick={() => handleOpenModal(row)}>Edit</Button>
          <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Marketing Agencies" 
        description="Manage your third-party marketing partners and brokers."
        action={
          <Button variant="primary" onClick={() => handleOpenModal()}>+ New Agency</Button>
        }
      />

      <div className={styles.tableCard}>
        <div className={styles.filterBar}>
          <input 
            type="text" 
            placeholder="Search agency name or PIC..." 
            className={styles.searchInput}
            defaultValue={searchParams.get('q') || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFilterChange('q', e.currentTarget.value);
              }
            }}
          />
        </div>

        <AdminTable 
          columns={columns} 
          data={agencies} 
          keyExtractor={(row) => row.id} 
          emptyMessage="No marketing agencies found."
        />

        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingAgency ? 'Edit Agency' : 'New Agency'}</h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Agency Name *</label>
                  <input type="text" name="name" defaultValue={editingAgency?.name || ''} required />
                </div>
                <div className={styles.formGroup}>
                  <label>PIC Name</label>
                  <input type="text" name="picName" defaultValue={editingAgency?.picName || ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input type="text" name="phone" defaultValue={editingAgency?.phone || ''} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" name="email" defaultValue={editingAgency?.email || ''} />
                </div>
                <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                  <label>Bank Info</label>
                  <input type="text" name="bankInfo" defaultValue={editingAgency?.bankInfo || ''} placeholder="e.g. BCA 123456789 a.n Budi" />
                </div>
              </div>
              <div className={styles.formActions}>
                <Button variant="outlined" type="button" onClick={handleCloseModal}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Agency'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
