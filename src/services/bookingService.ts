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
        propertyUnit: true
      }
    });
    return bookings.map(b => ({
      ...b,
      date: b.date.toISOString(),
    })) as unknown as Booking[];
  },

  async updateBookingStatus(id: string, status: Booking['status'], paymentStatus: Booking['paymentStatus']): Promise<Booking | null> {
    try {
      const booking = await prisma.booking.update({
        where: { id },
        data: { status, paymentStatus }
      });
      return {
        ...booking,
        date: booking.date.toISOString(),
      } as unknown as Booking;
    } catch {
      return null;
    }
  }
};
