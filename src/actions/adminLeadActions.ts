'use server';

import { revalidatePath } from 'next/cache';
import { LeadService } from '@/services/leadService';
import { assertActionPermission } from '@/lib/authGuard';
import { Lead } from '@/types/lead';

export async function updateLeadStatusAction(id: string, status: Lead['status']) {
  const auth = await assertActionPermission(['manage_leads']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  await LeadService.updateLeadStatus(id, status);
  revalidatePath('/admin/leads');
}
