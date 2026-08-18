import React from 'react';
import { BookingService } from '@/services/bookingService';
import { BookingListClient } from './BookingListClient';

export default async function AdminBookingsPage() {
  const bookings = await BookingService.getBookings();

  return <BookingListClient bookings={bookings} />;
}
