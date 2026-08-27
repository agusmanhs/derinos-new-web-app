'use server';

import { revalidatePath } from 'next/cache';
import { SalesService } from '@/services/salesService';
import { verifySession } from '@/lib/session';
import { Sale } from '@/types/sale';

export async function updateSaleStatusAction(id: string, status: Sale['status']) {
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_sales') && session?.roleName !== 'Super Admin') {
    throw new Error('Unauthorized');
  }

  await SalesService.updateSaleStatus(id, status);
  revalidatePath('/admin/sales');
}
