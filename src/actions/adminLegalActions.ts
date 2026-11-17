'use server';

import { revalidatePath } from 'next/cache';
import { assertActionPermission } from '@/lib/authGuard';
import { LegalService } from '@/services/legalService';
import { LegalDocumentItem } from '@/types/legal';

export async function saveLegalDocumentAction(doc: LegalDocumentItem) {
  const auth = await assertActionPermission(['manage_bookings', 'manage_sales', 'manage_projects']);
  if (!auth.authorized) {
    return { success: false, message: auth.message };
  }

  try {
    const saved = await LegalService.saveLegalDocument(doc);
    revalidatePath('/admin/legal');
    return { success: true, data: saved };
  } catch (error: any) {
    console.error('Error saving legal document:', error);
    return { success: false, message: error?.message || 'Gagal menyimpan berkas legalitas.' };
  }
}

export async function deleteLegalDocumentAction(id: string) {
  const auth = await assertActionPermission(['manage_bookings', 'manage_sales', 'manage_projects']);
  if (!auth.authorized) {
    return { success: false, message: auth.message };
  }

  try {
    await LegalService.deleteLegalDocument(id);
    revalidatePath('/admin/legal');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting legal document:', error);
    return { success: false, message: error?.message || 'Gagal menghapus berkas legalitas.' };
  }
}

