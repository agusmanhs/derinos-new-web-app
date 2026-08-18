import { Booking } from '@/types/booking';

export const mockBookings: Booking[] = [
  {
    id: 'bk-1',
    leadId: 'lead-1',
    customerName: 'Sarah Jenkins',
    projectId: 'p-1',
    projectTitle: 'Greenwood Residence',
    propertyUnitId: 'prop-1',
    unitNumber: 'A-01',
    price: 500000,
    bookingFee: 5000,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bk-2',
    leadId: 'lead-3',
    customerName: 'Amanda Brooks',
    projectId: 'p-3',
    projectTitle: 'The Valley Estate',
    propertyUnitId: 'prop-3',
    unitNumber: 'C-01',
    price: 750000,
    bookingFee: 7500,
    paymentStatus: 'Pending',
    status: 'Awaiting Payment',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
