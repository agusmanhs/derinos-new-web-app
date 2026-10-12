export interface Booking {
  id: string;
  leadId: string;
  customerId: string;
  customer?: { id: string; name: string };
  projectId: string;
  projectTitle: string;
  propertyUnitId: string;
  unitNumber: string;
  price: number;
  bookingFee: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded' | 'Forfeited';
  status: 'Awaiting Payment' | 'Confirmed' | 'Cancelled';
  date: string;
  cancellationReason?: string | null;
  cancellationNotes?: string | null;
  refundDecision?: 'Refunded' | 'Forfeited' | string | null;
  cancelledAt?: string | null;
  propertyUnit?: {
    id: string;
    phase?: {
      id: string;
      name: string;
    } | null;
  };
}
