import React from 'react';
import { BookingService } from '@/services/bookingService';
import { BookingListClient } from './BookingListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminBookingsPage() {
  await requirePermission(['view_bookings', 'manage_bookings']);
  const bookings = await BookingService.getBookings();

  return <BookingListClient bookings={bookings} />;
}
