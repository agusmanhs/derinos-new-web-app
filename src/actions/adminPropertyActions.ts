'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { ProjectService } from '@/services/projectService';
import { verifySession } from '@/lib/session';

export async function archivePropertyAction(id: string) {
  const session = await verifySession();
  if (!session || !['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'].includes(session.role)) {
    throw new Error('Unauthorized');
  }

  await PropertyService.archiveProperty(id);
  revalidatePath('/admin/properties');
  revalidatePath('/properties');
}

export async function savePropertyAction(prevState: unknown, formData: FormData) {
  const session = await verifySession();
  if (!session || !['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'].includes(session.role)) {
    return { success: false, message: 'Unauthorized access' };
  }

  const id = formData.get('id') as string | null;
  const projectId = formData.get('projectId') as string;
  const unitNumber = formData.get('unitNumber') as string;
  const typeName = formData.get('typeName') as string;
  const statusId = formData.get('statusId') as string;
  const price = parseFloat(formData.get('price') as string);
  
  if (!projectId || !unitNumber || !typeName || !statusId || isNaN(price)) {
    return { success: false, message: 'Project, Unit Number, Type, Status, and valid Price are required.' };
  }

  // Fetch project to get its title
  const project = await ProjectService.getProjectById(projectId);
  if (!project) {
    return { success: false, message: 'Selected project does not exist.' };
  }

  try {
    const payload = {
      projectId,
      projectTitle: project.title,
      unitNumber,
      typeName,
      statusId,
      customerId: (formData.get('customerId') as string) || null,
      price,
      landSize: parseFloat(formData.get('landSize') as string) || 0,
      buildingSize: parseFloat(formData.get('buildingSize') as string) || 0,
      bedrooms: parseInt(formData.get('bedrooms') as string) || 0,
      bathrooms: parseInt(formData.get('bathrooms') as string) || 0,
      carports: parseInt(formData.get('carports') as string) || 0,
    };

    if (id) {
      await PropertyService.updateProperty(id, payload);
    } else {
      await PropertyService.createProperty(payload);
    }

    revalidatePath('/admin/properties');
    revalidatePath('/properties');
  } catch (error) {
    console.error('Error saving property:', error);
    return { success: false, message: 'An error occurred while saving the property.' };
  }

  redirect('/admin/properties');
}

export async function createPropertyAjaxAction(payload: any) {
  const session = await verifySession();
  if (!session || !['SUPER_ADMIN', 'MANAGEMENT', 'PROJECT_MANAGER', 'SALES_MANAGER'].includes(session.role)) {
    return { success: false, message: 'Unauthorized access' };
  }

  if (!payload.projectId || !payload.unitNumber || !payload.typeName || !payload.statusId || isNaN(payload.price)) {
    return { success: false, message: 'Project, Unit Number, Type, Status, and valid Price are required.' };
  }

  const project = await ProjectService.getProjectById(payload.projectId);
  if (!project) {
    return { success: false, message: 'Selected project does not exist.' };
  }

  try {
    const data = {
      ...payload,
      projectTitle: project.title,
    };

    const newProperty = await PropertyService.createProperty(data);

    revalidatePath(`/admin/projects/${project.slug}`);
    revalidatePath(`/admin/projects/${project.id}`);
    
    return { success: true, property: newProperty };
  } catch (error) {
    console.error('Error saving property:', error);
    return { success: false, message: 'An error occurred while saving the property.' };
  }
}
