'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Modal } from '@/components/ui/Modal/Modal';
import { Booking } from '@/types/booking';
import { updateBookingStatusAction } from '@/actions/adminBookingActions';
import styles from './BookingListClient.module.css';

interface Props {
  bookings: Booking[];
}

export const BookingListClient: React.FC<Props> = ({ bookings }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local state for instant optimistic updates
  const [items, setItems] = useState<Booking[]>(bookings);

  React.useEffect(() => {
    setItems(bookings);
  }, [bookings]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancellationReason, setCancellationReason] = useState('Bank Reject / BI Checking (SLIK Gagal)');
  const [refundDecision, setRefundDecision] = useState<'Refunded' | 'Forfeited'>('Refunded');
  const [cancellationNotes, setCancellationNotes] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = (id: string, newStatus: Booking['status'], currentPayment: Booking['paymentStatus']) => {
    setItems(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    startTransition(async () => {
      try {
        await updateBookingStatusAction(id, newStatus, currentPayment);
        router.refresh();
      } catch (err: any) {
        console.error('Failed to update status:', err);
        alert('Gagal mengubah status: ' + (err?.message || 'Terjadi kesalahan'));
        router.refresh();
      }
    });
  };

  const handlePaymentChange = (id: string, currentStatus: Booking['status'], newPayment: Booking['paymentStatus']) => {
    setItems(prev => prev.map(b => b.id === id ? { ...b, paymentStatus: newPayment } : b));
    startTransition(async () => {
      try {
        await updateBookingStatusAction(id, currentStatus, newPayment);
        router.refresh();
      } catch (err: any) {
        console.error('Failed to update payment status:', err);
        alert('Gagal mengubah status pembayaran: ' + (err?.message || 'Terjadi kesalahan'));
        router.refresh();
      }
    });
  };

  const handleOpenCancelModal = (booking: Booking) => {
    setSelectedBookingForCancel(booking);
    setCancellationReason('Bank Reject / BI Checking (SLIK Gagal)');
    setRefundDecision('Refunded');
    setCancellationNotes('');
    setIsCancelModalOpen(true);
  };

  const handleReasonChange = (reason: string) => {
    setCancellationReason(reason);
    // Smart recommendation based on reason
    if (reason.startsWith('Bank Reject') || reason.startsWith('Double Booking')) {
      setRefundDecision('Refunded');
    } else if (reason.startsWith('Customer Request') || reason.startsWith('Masalah Finansial')) {
      setRefundDecision('Forfeited');
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    const cancelId = selectedBookingForCancel.id;
    const resolvedPayment = refundDecision === 'Refunded' ? 'Refunded' : 'Forfeited';

    // Optimistic update
    setItems(prev => prev.map(b => b.id === cancelId ? {
      ...b,
      status: 'Cancelled',
      paymentStatus: resolvedPayment,
      cancellationReason,
      cancellationNotes,
      refundDecision,
      cancelledAt: new Date().toISOString()
    } : b));

    setIsCancelModalOpen(false);
    setSelectedBookingForCancel(null);

    startTransition(async () => {
      try {
        await updateBookingStatusAction(
          cancelId,
          'Cancelled',
          resolvedPayment,
          {
            cancellationReason,
            cancellationNotes,
            refundDecision
          }
        );
        router.refresh();
      } catch (err: any) {
        console.error('Failed to cancel booking:', err);
        alert('Gagal membatalkan booking: ' + (err?.message || 'Terjadi kesalahan'));
        router.refresh();
      }
    });
  };

  // Derive unique projects and phases for dropdowns
  const uniqueProjects = useMemo(() => {
    const projects = new Set(items.map(b => b.projectTitle));
    return Array.from(projects).filter(Boolean);
  }, [items]);

  const uniquePhases = useMemo(() => {
    const phases = new Set(items.map(b => b.propertyUnit?.phase?.name));
    return Array.from(phases).filter(Boolean) as string[];
  }, [items]);

  // Filter bookings based on state
  const filteredBookings = useMemo(() => {
    let result = items;

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
  }, [items, searchTerm, projectFilter, phaseFilter, paymentStatusFilter, bookingStatusFilter]);

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
        else if (row.paymentStatus === 'Forfeited') { badgeColor = '#f3e8ff'; textColor = '#6b21a8'; }

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
            <option value="Refunded">Refunded (Dana Kembali)</option>
            <option value="Forfeited">Forfeited (Dana Hangus)</option>
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
          <div>
            <select 
              value={row.status} 
              onChange={(e) => {
                const val = e.target.value as Booking['status'];
                if (val === 'Cancelled') {
                  handleOpenCancelModal(row);
                } else {
                  handleStatusChange(row.id, val, row.paymentStatus);
                }
              }}
              disabled={isPending}
              className={styles.statusSelect}
              style={{ backgroundColor: badgeColor, color: textColor }}
            >
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {row.status === 'Cancelled' && (
              <div style={{ marginTop: '8px', padding: '6px 8px', borderRadius: '6px', background: '#fef2f2', border: '1px solid #fee2e2', fontSize: '0.75rem', minWidth: '160px' }}>
                <div style={{ fontWeight: 600, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>🚫 {row.cancellationReason || 'Dibatalkan'}</span>
                </div>
                <div style={{ marginTop: '2px', fontWeight: 600, color: row.paymentStatus === 'Refunded' || row.refundDecision === 'Refunded' ? '#047857' : '#7c3aed' }}>
                  {row.paymentStatus === 'Refunded' || row.refundDecision === 'Refunded' ? '✓ DP Di-Refund' : '✕ DP Hangus'}
                </div>
                {row.cancellationNotes && (
                  <div style={{ marginTop: '3px', color: '#4b5563', fontStyle: 'italic', fontSize: '0.7rem' }}>
                    &ldquo;{row.cancellationNotes}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>
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
              <option value="Refunded">Refunded (Dana Kembali)</option>
              <option value="Forfeited">Forfeited (Dana Hangus)</option>
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

      {/* Cancellation Modal */}
      <Modal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        title="Konfirmasi Pembatalan Booking"
      >
        {selectedBookingForCancel && (
          <div>
            <div className={styles.modalSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Customer</span>
                <span className={styles.summaryValue}>{selectedBookingForCancel.customer?.name || 'Customer'}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Unit Properti</span>
                <span className={styles.summaryValue}>Unit {selectedBookingForCancel.unitNumber.toUpperCase()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tanda Jadi / DP</span>
                <span className={styles.summaryValue} style={{ color: '#059669' }}>
                  Rp {selectedBookingForCancel.bookingFee.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Alasan Pembatalan (Cancellation Reason):</label>
              <select 
                className={styles.formSelect}
                value={cancellationReason}
                onChange={(e) => handleReasonChange(e.target.value)}
              >
                <option value="Bank Reject / BI Checking (SLIK Gagal)">Bank Reject / BI Checking (SLIK Gagal)</option>
                <option value="Customer Request / Batal Sepihak">Customer Request / Batal Sepihak</option>
                <option value="Masalah Finansial / Dana Kurang">Masalah Finansial / Dana Kurang</option>
                <option value="Double Booking / Kesalahan Sistem">Double Booking / Kesalahan Sistem</option>
                <option value="Lainnya / Alasan Khusus">Lainnya / Alasan Khusus</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Keputusan Pengembalian Dana (Refund Policy):</label>
              <div className={styles.refundCards}>
                <div 
                  className={`${styles.refundCard} ${refundDecision === 'Refunded' ? styles.refundCardActiveRefund : ''}`}
                  onClick={() => setRefundDecision('Refunded')}
                >
                  <div className={styles.refundCardTitle} style={{ color: '#059669' }}>
                    <span>🟢</span> Dana Di-Refund (Dikembalikan)
                  </div>
                  <span className={styles.refundCardDesc}>
                    Uang tanda jadi/DP dikembalikan ke konsumen (contoh: bank reject atau kesalahan sistem).
                  </span>
                </div>

                <div 
                  className={`${styles.refundCard} ${refundDecision === 'Forfeited' ? styles.refundCardActiveForfeit : ''}`}
                  onClick={() => setRefundDecision('Forfeited')}
                >
                  <div className={styles.refundCardTitle} style={{ color: '#dc2626' }}>
                    <span>🔴</span> Dana Hangus (Non-Refundable)
                  </div>
                  <span className={styles.refundCardDesc}>
                    Uang tanda jadi masuk kas developer karena pembatalan sepihak oleh konsumen.
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Catatan / Keterangan Detail:</label>
              <textarea 
                className={styles.formTextarea}
                rows={3}
                placeholder="Tuliskan keterangan detail hasil bank check atau alasan pembatalan..."
                value={cancellationNotes}
                onChange={(e) => setCancellationNotes(e.target.value)}
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.btnCancel}
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isPending}
              >
                Tutup / Batal
              </button>
              <button 
                type="button" 
                className={styles.btnConfirmDanger}
                onClick={handleConfirmCancel}
                disabled={isPending}
              >
                {isPending ? 'Memproses...' : 'Konfirmasi Batalkan Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
