'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Booking } from '@/types/booking';
import { updateBookingStatusAction } from '@/actions/adminBookingActions';
import styles from './BookingListClient.module.css';

interface Props {
  bookings: Booking[];
}

export const BookingListClient: React.FC<Props> = ({ bookings }) => {
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = (id: string, newStatus: Booking['status'], currentPayment: Booking['paymentStatus']) => {
    startTransition(async () => {
      await updateBookingStatusAction(id, newStatus, currentPayment);
    });
  };

  const handlePaymentChange = (id: string, currentStatus: Booking['status'], newPayment: Booking['paymentStatus']) => {
    startTransition(async () => {
      await updateBookingStatusAction(id, currentStatus, newPayment);
    });
  };

  // Derive unique projects and phases for dropdowns
  const uniqueProjects = useMemo(() => {
    const projects = new Set(bookings.map(b => b.projectTitle));
    return Array.from(projects).filter(Boolean);
  }, [bookings]);

  const uniquePhases = useMemo(() => {
    const phases = new Set(bookings.map(b => b.propertyUnit?.phase?.name));
    return Array.from(phases).filter(Boolean) as string[];
  }, [bookings]);

  // Filter bookings based on state
  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.customer?.name.toLowerCase().includes(lowerSearch) || 
        b.unitNumber.toLowerCase().includes(lowerSearch)
      );
    }

    if (projectFilter) {
      result = result.filter(b => b.projectTitle === projectFilter);
    }

    if (phaseFilter) {
      result = result.filter(b => b.propertyUnit?.phase?.name === phaseFilter);
    }

    if (paymentStatusFilter) {
      result = result.filter(b => b.paymentStatus === paymentStatusFilter);
    }

    if (bookingStatusFilter) {
      result = result.filter(b => b.status === bookingStatusFilter);
    }

    return result;
  }, [bookings, searchTerm, projectFilter, phaseFilter, paymentStatusFilter, bookingStatusFilter]);

  // Paginate the filtered results
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, projectFilter, phaseFilter, paymentStatusFilter, bookingStatusFilter]);

  const columns = [
    {
      header: 'Customer & Date',
      accessor: (row: Booking) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '0.95rem' }}>{row.customer?.name || 'Unknown Customer'}</strong>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {new Date(row.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      )
    },
    {
      header: 'Property Unit',
      accessor: (row: Booking) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '0.95rem', color: '#2563eb' }}>Unit {row.unitNumber.toUpperCase()}</strong>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            {row.projectTitle} {row.propertyUnit?.phase?.name ? `- ${row.propertyUnit.phase.name}` : ''}
          </span>
        </div>
      )
    },
    {
      header: 'Financials',
      accessor: (row: Booking) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '0.9rem', color: '#059669' }}>Fee: Rp {row.bookingFee.toLocaleString('id-ID')}</strong>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total: Rp {row.price.toLocaleString('id-ID')}</span>
        </div>
      )
    },
    {
      header: 'Payment',
      accessor: (row: Booking) => {
        let badgeColor = '#f3f4f6';
        let textColor = '#374151';
        if (row.paymentStatus === 'Paid') { badgeColor = '#d1fae5'; textColor = '#065f46'; }
        else if (row.paymentStatus === 'Pending') { badgeColor = '#fef3c7'; textColor = '#92400e'; }
        else if (row.paymentStatus === 'Refunded') { badgeColor = '#fee2e2'; textColor = '#991b1b'; }

        return (
          <select 
            value={row.paymentStatus} 
            onChange={(e) => handlePaymentChange(row.id, row.status, e.target.value as Booking['paymentStatus'])}
            disabled={isPending}
            className={styles.statusSelect}
            style={{ backgroundColor: badgeColor, color: textColor }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        );
      }
    },
    {
      header: 'Booking Status',
      accessor: (row: Booking) => {
        let badgeColor = '#f3f4f6';
        let textColor = '#374151';
        if (row.status === 'Confirmed') { badgeColor = '#d1fae5'; textColor = '#065f46'; }
        else if (row.status === 'Awaiting Payment') { badgeColor = '#fef3c7'; textColor = '#92400e'; }
        else if (row.status === 'Cancelled') { badgeColor = '#fee2e2'; textColor = '#991b1b'; }

        return (
          <select 
            value={row.status} 
            onChange={(e) => handleStatusChange(row.id, e.target.value as Booking['status'], row.paymentStatus)}
            disabled={isPending}
            className={styles.statusSelect}
            style={{ backgroundColor: badgeColor, color: textColor }}
          >
            <option value="Awaiting Payment">Awaiting Payment</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        );
      }
    }
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader 
        title="Bookings" 
        description="Manage property reservations and booking fees."
      />

      <div className={styles.filtersCard}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>Search</label>
            <input 
              type="text" 
              placeholder="Search customer or unit..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Project</label>
            <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className={styles.filterSelect}>
              <option value="">All Projects</option>
              {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Phase (Tahapan)</label>
            <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} className={styles.filterSelect}>
              <option value="">All Phases</option>
              {uniquePhases.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Payment Status</label>
            <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)} className={styles.filterSelect}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Booking Status</label>
            <select value={bookingStatusFilter} onChange={(e) => setBookingStatusFilter(e.target.value)} className={styles.filterSelect}>
              <option value="">All Statuses</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <AdminTable 
          columns={columns} 
          data={paginatedBookings} 
          keyExtractor={(row) => row.id} 
          emptyMessage="No bookings found."
        />

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageButton} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className={styles.pageButton} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
