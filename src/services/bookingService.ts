import { Booking } from '@/types/booking';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const BookingService = {
  async getBookings(): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      orderBy: { date: 'desc' },
      include: {
        customer: true,
        project: true,
        agency: true,
        sales: true,
        propertyUnit: {
          include: {
            phase: true
          }
        }
      }
    });
    return bookings.map(b => {
      const saleRecord = (b as any).sales?.[0] || null;
      return {
        ...b,
        date: b.date.toISOString(),
        sale: saleRecord ? {
          ...saleRecord,
          date: saleRecord.date?.toISOString ? saleRecord.date.toISOString() : saleRecord.date
        } : null,
      };
    }) as unknown as Booking[];
  },

  async updateBookingStatus(
    id: string, 
    status: Booking['status'], 
    paymentStatus: Booking['paymentStatus'],
    cancellationData?: {
      cancellationReason?: string;
      cancellationNotes?: string;
      refundDecision?: string;
    }
  ): Promise<Booking | null> {
    try {
      const updateData: any = { status, paymentStatus };

      if (status === 'Cancelled') {
        updateData.cancelledAt = new Date();
        if (cancellationData?.cancellationReason) {
          updateData.cancellationReason = cancellationData.cancellationReason;
        }
        if (cancellationData?.cancellationNotes !== undefined) {
          updateData.cancellationNotes = cancellationData.cancellationNotes;
        }
        if (cancellationData?.refundDecision) {
          updateData.refundDecision = cancellationData.refundDecision;
          if (cancellationData.refundDecision === 'Refunded') {
            updateData.paymentStatus = 'Refunded';
          } else if (cancellationData.refundDecision === 'Forfeited') {
            updateData.paymentStatus = 'Forfeited';
          }
        }
      }

      const booking = await prisma.booking.update({
        where: { id },
        data: updateData
      });

      // SYNC LOGIC: If booking is cancelled, revert property unit to Available and record history
      if (status === 'Cancelled') {
        const availableStatus = await prisma.propertyStatus.findUnique({
          where: { name: 'Available' }
        });
        
        if (availableStatus && booking.propertyUnitId) {
          // Revert unit status to Available and clear customer assignment
          await prisma.propertyUnit.update({
            where: { id: booking.propertyUnitId },
            data: { 
              statusId: availableStatus.id,
              customerId: null
            }
          });

          // Build descriptive note for unit status history
          const reasonText = cancellationData?.cancellationReason || booking.cancellationReason || 'Dibatalkan';
          const refundText = (cancellationData?.refundDecision || booking.refundDecision) === 'Refunded'
            ? 'Dana Di-Refund (Dikembalikan)'
            : 'Dana Hangus (Non-Refundable)';
          const extraNotes = cancellationData?.cancellationNotes || booking.cancellationNotes;
          
          const historyNotes = `Booking Dibatalkan [Alasan: ${reasonText} | Kebijakan: ${refundText}]${extraNotes ? ` - Catatan: ${extraNotes}` : ''}`;

          // Record history in UnitStatusHistory
          await prisma.unitStatusHistory.create({
            data: {
              propertyUnitId: booking.propertyUnitId,
              statusId: availableStatus.id,
              statusName: 'Cancelled',
              customerId: booking.customerId,
              agencyId: booking.agencyId,
              notes: historyNotes
            }
          });
        }
      }

      return {
        ...booking,
        date: booking.date.toISOString(),
      } as unknown as Booking;
    } catch (error) {
      console.error('Error in BookingService.updateBookingStatus:', error);
      throw error;
    }
  }
};
