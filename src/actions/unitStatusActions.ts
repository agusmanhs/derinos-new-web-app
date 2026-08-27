'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateUnitStatusFromSitePlan(
  propertyUnitId: string,
  newStatusId: string,
  newStatusName: string, // "Available", "Booking", "Sold", dll
  customerId?: string,
  agencyId?: string,
  bookingFee?: number,
  notes?: string
) {
  try {
    const unit = await prisma.propertyUnit.findUnique({
      where: { id: propertyUnitId },
      include: { project: true }
    });

    if (!unit) {
      return { success: false, message: 'Property unit not found' };
    }

    // Prepare transaction operations
    const operations: any[] = [];

    // 1. Update the property unit status
    operations.push(
      prisma.propertyUnit.update({
        where: { id: propertyUnitId },
        data: {
          statusId: newStatusId,
          customerId: customerId || null,
        }
      })
    );

    // 2. Logic based on status transition
    const requiresCustomer = newStatusName !== 'Available' && newStatusName !== 'Unmapped / Other';
    if (requiresCustomer && !customerId) {
      throw new Error(`Customer is required when changing status to ${newStatusName}`);
    }

    const latestBooking = await prisma.booking.findFirst({
      where: { propertyUnitId, status: { not: 'Cancelled' } },
      orderBy: { date: 'desc' }
    });

    if (newStatusName === 'Available') {
      // If returning to Available, cancel the latest active booking
      if (latestBooking) {
        operations.push(
          prisma.booking.update({
            where: { id: latestBooking.id },
            data: { status: 'Cancelled' }
          })
        );
      }
    } else if (requiresCustomer) {
      // For all active statuses, ensure we either update the existing booking or create a new one
      if (latestBooking) {
        operations.push(
          prisma.booking.update({
            where: { id: latestBooking.id },
            data: {
              customerId,
              agencyId: agencyId || null,
              ...(bookingFee ? { bookingFee } : {})
            }
          })
        );
      } else {
        // No active booking exists (e.g. jumped straight from Available to Lunas)
        operations.push(
          prisma.booking.create({
            data: {
              customerId,
              agencyId: agencyId || null,
              projectId: unit.projectId,
              projectTitle: unit.projectTitle,
              propertyUnitId,
              unitNumber: unit.unitNumber,
              price: unit.price,
              bookingFee: bookingFee || 0,
              paymentStatus: 'Pending',
              status: newStatusName === 'Sold' || newStatusName === 'Lunas' || newStatusName === 'Cash' ? 'Confirmed' : 'Awaiting Payment'
            }
          })
        );
      }
    }

    // Execute transaction
    await prisma.$transaction(operations);

    revalidatePath(`/admin/projects/${unit.projectId}`);
    return { success: true, message: `Successfully updated status to ${newStatusName}` };

  } catch (error: any) {
    console.error('Error updating unit status:', error);
    return { success: false, message: error.message || 'Failed to update status' };
  }
}
