'use server';

import { revalidatePath } from 'next/cache';
import { MarketingService } from '@/services/marketingService';

export async function saveAgencyAction(formData: FormData) {
  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string;
  const picName = formData.get('picName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const bankInfo = formData.get('bankInfo') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  const data = { name, picName, phone, email, bankInfo };

  if (id) {
    await MarketingService.updateAgency(id, data);
  } else {
    await MarketingService.createAgency(data);
  }

  revalidatePath('/admin/agencies');
}

export async function deleteAgencyAction(id: string) {
  await MarketingService.deleteAgency(id);
  revalidatePath('/admin/agencies');
}

export async function updateCommissionAction(id: string, amount: number, status: string, paymentNotes: string) {
  const data: any = { amount, status, paymentNotes };
  if (status === 'Paid') {
    data.paymentDate = new Date();
  } else {
    data.paymentDate = null;
  }
  
  await MarketingService.updateCommission(id, data);
  revalidatePath('/admin/agencies');
  // Revalidate specific agency page is tricky without the ID, but global revalidate might be fine 
  // or we can pass agencyId in the future if needed.
}
