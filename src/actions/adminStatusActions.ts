'use server';

import { revalidatePath } from 'next/cache';
import { statusService } from '../services/statusService';

export async function getProjectStatuses(projectId: string) {
  try {
    return await statusService.getStatusesByProject(projectId);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw new Error('Failed to fetch statuses');
  }
}

export async function createStatusAction(data: { projectId: string; name: string; colorHex: string; order?: number }) {
  try {
    const status = await statusService.createStatus(data);
    revalidatePath(`/admin/projects/${data.projectId}`);
    return status;
  } catch (error) {
    console.error('Error creating status:', error);
    throw new Error('Failed to create status');
  }
}

export async function updateStatusAction(id: string, projectId: string, data: { name?: string; colorHex?: string; order?: number }) {
  try {
    const status = await statusService.updateStatus(id, data);
    revalidatePath(`/admin/projects/${projectId}`);
    return status;
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }
}

export async function deleteStatusAction(id: string, projectId: string) {
  try {
    await statusService.deleteStatus(id);
    revalidatePath(`/admin/projects/${projectId}`);
    return true;
  } catch (error) {
    console.error('Error deleting status:', error);
    throw new Error('Failed to delete status');
  }
}
