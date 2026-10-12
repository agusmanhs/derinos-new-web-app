'use server';

import { revalidatePath } from 'next/cache';
import { SalesService } from '@/services/salesService';
import { verifySession } from '@/lib/session';
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
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_sales') && session?.roleName !== 'Super Admin') {
    throw new Error('Unauthorized');
  }

  const result = await SalesService.createOrUpdateSale(data);
  revalidatePath('/admin/sales');
  revalidatePath('/admin/bookings');
  revalidatePath('/admin/properties', 'layout');
  revalidatePath('/admin/projects', 'layout');
  return { success: true, sale: result };
}

export async function updateSaleStatusAction(id: string, status: Sale['status']) {
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_sales') && session?.roleName !== 'Super Admin') {
    throw new Error('Unauthorized');
  }

  await SalesService.updateSaleStatus(id, status);
  revalidatePath('/admin/sales');
  revalidatePath('/admin/bookings');
  revalidatePath('/admin/properties', 'layout');
  return { success: true };
}
