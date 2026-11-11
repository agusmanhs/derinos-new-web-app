'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { assertActionPermission } from '@/lib/authGuard';

export async function saveConstructionProgressAction(prevState: unknown, formData: FormData) {
  const auth = await assertActionPermission(['manage_projects', 'update_construction_progress', 'manage_construction']);
  if (!auth.authorized) {
    return { success: false, message: auth.message };
  }

  const id = formData.get('id') as string;
  const overallProgress = parseInt(formData.get('overallProgress') as string) || 0;
  const targetCompletion = formData.get('targetCompletion') as string;

  if (!id || !targetCompletion) {
    return { success: false, message: 'ID and Target Completion are required.' };
  }

  try {
    await ProjectService.updateConstructionProgress(id, overallProgress, targetCompletion);
    revalidatePath('/admin/construction');
    revalidatePath(`/admin/construction/${id}`);
    revalidatePath(`/projects/${id}`); // Assuming projects might use slug or id
    revalidatePath('/construction');
  } catch (error) {
    console.error('Error saving construction progress:', error);
    return { success: false, message: 'An error occurred while saving.' };
  }

  redirect('/admin/construction');
}
