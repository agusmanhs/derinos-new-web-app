import { Booking } from '@/types/booking';
import { mockBookings } from '@/lib/mockBookingData';

export const BookingService = {
  async getBookings(): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockBookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async updateBookingStatus(id: string, status: Booking['status'], paymentStatus: Booking['paymentStatus']): Promise<Booking | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockBookings.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    mockBookings[index].status = status;
    mockBookings[index].paymentStatus = paymentStatus;
    return mockBookings[index];
  }
};
