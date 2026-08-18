'use client';

import React, { useTransition } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Booking } from '@/types/booking';
import { updateBookingStatusAction } from '@/actions/adminBookingActions';

interface Props {
  bookings: Booking[];
}

export const BookingListClient: React.FC<Props> = ({ bookings }) => {
  const [isPending, startTransition] = useTransition();

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

  const columns = [
    {
      header: 'Customer',
      accessor: (row: Booking) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.customerName}</strong>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Unit',
      accessor: (row: Booking) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.unitNumber}</strong>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.projectTitle}</span>
        </div>
      )
    },
    {
      header: 'Financials',
      accessor: (row: Booking) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Fee: ${row.bookingFee.toLocaleString()}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total: ${row.price.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Payment Status',
      accessor: (row: Booking) => (
        <select 
          value={row.paymentStatus} 
          onChange={(e) => handlePaymentChange(row.id, row.status, e.target.value as Booking['paymentStatus'])}
          disabled={isPending}
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Refunded">Refunded</option>
        </select>
      )
    },
    {
      header: 'Booking Status',
      accessor: (row: Booking) => (
        <select 
          value={row.status} 
          onChange={(e) => handleStatusChange(row.id, e.target.value as Booking['status'], row.paymentStatus)}
          disabled={isPending}
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}
        >
          <option value="Awaiting Payment">Awaiting Payment</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Bookings" 
        description="Manage property reservations and booking fees."
      />

      <AdminTable 
        columns={columns} 
        data={bookings} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No bookings found."
      />
    </div>
  );
};
