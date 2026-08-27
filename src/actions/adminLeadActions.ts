'use server';

import { revalidatePath } from 'next/cache';
import { LeadService } from '@/services/leadService';
import { verifySession } from '@/lib/session';
import { Lead } from '@/types/lead';

export async function updateLeadStatusAction(id: string, status: Lead['status']) {
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_leads') && session?.roleName !== 'Super Admin') {
    throw new Error('Unauthorized');
  }

  await LeadService.updateLeadStatus(id, status);
  revalidatePath('/admin/leads');
}
