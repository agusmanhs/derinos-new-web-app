export interface Sale {
  id: string;
  bookingId: string;
  customerId: string;
  customer?: { id: string; name: string; phone?: string | null; email?: string | null };
  agencyId?: string | null;
  agency?: { id: string; name: string } | null;
  projectTitle: string;
  unitNumber: string;
  contractPrice: number;
  paymentMethod: 'Cash' | 'Mortgage' | 'Installment';
  status: 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
