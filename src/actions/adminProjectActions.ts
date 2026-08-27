'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { verifySession } from '@/lib/session';

export async function archiveProjectAction(id: string) {
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_projects') && session?.roleName !== 'Super Admin') {
    throw new Error('Unauthorized');
  }

  await ProjectService.archiveProject(id);
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
}

export async function deleteProjectAction(id: string) {
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_projects') && session?.roleName !== 'Super Admin') {
    throw new Error('Unauthorized');
  }

  await ProjectService.deleteProject(id);
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
}

export async function saveProjectAction(prevState: unknown, formData: FormData) {
  const session = await verifySession();
  if (!session?.permissions?.includes('manage_projects') && session?.roleName !== 'Super Admin') {
    return { success: false, message: 'Unauthorized access' };
  }

  const id = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const location = formData.get('location') as string;
  const status = formData.get('status') as "Pre-Selling" | "Under Construction" | "Ready to Move" | "Sold Out";

  if (!title || !slug || !location || !status) {
    return { success: false, message: 'Title, slug, location, and status are required fields.' };
  }

  try {
    const payload = {
      title,
      slug,
      location,
      status,
      startingPrice: (formData.get('startingPrice') as string) || '',
      description: (formData.get('description') as string) || '',
      totalArea: (formData.get('totalArea') as string) || '',
      totalUnits: parseInt((formData.get('totalUnits') as string) || '0', 10),
      metaTitle: (formData.get('metaTitle') as string) || '',
      metaDescription: (formData.get('metaDescription') as string) || '',
    };

    if (id) {
      await ProjectService.updateProject(id, payload);
    } else {
      await ProjectService.createProject(payload);
    }

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    
    // Using redirect inside try-catch requires careful handling in Next.js Server Actions
    // because redirect() throws an error internally.
  } catch (error) {
    console.error('Error saving project:', error);
    return { success: false, message: 'An error occurred while saving the project.' };
  }

  // Redirect outside try-catch to allow Next.js to handle it properly
  redirect('/admin/projects');
}
