'use server';

import { revalidatePath } from 'next/cache';
import { BookingService } from '@/services/bookingService';
import { assertActionPermission } from '@/lib/authGuard';
import { Booking } from '@/types/booking';

export async function updateBookingStatusAction(
  id: string, 
  status: Booking['status'], 
  paymentStatus: Booking['paymentStatus'],
  cancellationData?: {
    cancellationReason?: string;
    cancellationNotes?: string;
    refundDecision?: string;
  }
) {
  const auth = await assertActionPermission(['manage_bookings']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  const updated = await BookingService.updateBookingStatus(id, status, paymentStatus, cancellationData);
  revalidatePath('/admin/bookings');
  revalidatePath('/admin/properties', 'layout');
  revalidatePath('/admin/projects', 'layout');
  return { success: true, booking: updated };
}
