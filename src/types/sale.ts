export interface Sale {
  id: string;
  bookingId: string;
  customerName: string;
  projectTitle: string;
  unitNumber: string;
  contractPrice: number;
  paymentMethod: 'Cash' | 'Mortgage' | 'Installment';
  status: 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
}
