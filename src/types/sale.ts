export interface Sale {
  id: string;
  bookingId: string;
  customerId: string;
  customer?: { id: string; name: string };
  projectTitle: string;
  unitNumber: string;
  contractPrice: number;
  paymentMethod: 'Cash' | 'Mortgage' | 'Installment';
  status: 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
}
