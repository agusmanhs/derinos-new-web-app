export interface Booking {
  id: string;
  leadId: string;
  customerName: string;
  projectId: string;
  projectTitle: string;
  propertyUnitId: string;
  unitNumber: string;
  price: number;
  bookingFee: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  status: 'Awaiting Payment' | 'Confirmed' | 'Cancelled';
  date: string;
}
