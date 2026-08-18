import { Sale } from '@/types/sale';

export const mockSales: Sale[] = [
  {
    id: 'sale-1',
    bookingId: 'bk-1',
    customerName: 'Sarah Jenkins',
    projectTitle: 'Greenwood Residence',
    unitNumber: 'A-01',
    contractPrice: 500000,
    paymentMethod: 'Mortgage',
    status: 'In Progress',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
