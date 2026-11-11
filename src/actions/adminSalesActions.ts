'use server';

import { revalidatePath } from 'next/cache';
import { SalesService } from '@/services/salesService';
import { assertActionPermission } from '@/lib/authGuard';
import { Sale } from '@/types/sale';

export async function createOrUpdateSaleAction(data: {
  bookingId: string;
  customerId: string;
  agencyId?: string | null;
  projectTitle: string;
  unitNumber: string;
  contractPrice: number;
  paymentMethod: 'Cash' | 'Mortgage' | 'Installment';
  status?: 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string | null;
}) {
  const auth = await assertActionPermission(['manage_bookings', 'manage_sales']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  const result = await SalesService.createOrUpdateSale(data);
  revalidatePath('/admin/sales');
  revalidatePath('/admin/bookings');
  revalidatePath('/admin/properties', 'layout');
  revalidatePath('/admin/projects', 'layout');
  return { success: true, sale: result };
}

export async function updateSaleStatusAction(id: string, status: Sale['status']) {
  const auth = await assertActionPermission(['manage_bookings', 'manage_sales']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  await SalesService.updateSaleStatus(id, status);
  revalidatePath('/admin/sales');
  revalidatePath('/admin/bookings');
  revalidatePath('/admin/properties', 'layout');
  return { success: true };
}
