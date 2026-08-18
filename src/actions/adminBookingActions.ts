'use server';

import { revalidatePath } from 'next/cache';
import { BookingService } from '@/services/bookingService';
import { verifySession } from '@/lib/session';
import { Booking } from '@/types/booking';

export async function updateBookingStatusAction(id: string, status: Booking['status'], paymentStatus: Booking['paymentStatus']) {
  const session = await verifySession();
  if (!session || !['SUPER_ADMIN', 'MANAGEMENT', 'SALES_MANAGER'].includes(session.role)) {
    throw new Error('Unauthorized');
  }

  await BookingService.updateBookingStatus(id, status, paymentStatus);
  revalidatePath('/admin/bookings');
}
