'use server';

import { revalidatePath } from 'next/cache';
import { statusService } from '../services/statusService';

export async function getProjectStatuses() {
  try {
    return await statusService.getStatuses();
  } catch (error) {
    console.error('Error fetching statuses:', error);
    throw new Error('Failed to fetch statuses');
  }
}

export async function createStatusAction(data: { name: string; colorHex: string; order?: number }) {
  try {
    const status = await statusService.createStatus(data);
    revalidatePath(`/admin/settings/statuses`);
    revalidatePath(`/admin/properties`);
    return status;
  } catch (error) {
    console.error('Error creating status:', error);
    throw new Error('Failed to create status');
  }
}

export async function updateStatusAction(id: string, data: { name?: string; colorHex?: string; order?: number }) {
  try {
    const status = await statusService.updateStatus(id, data);
    revalidatePath(`/admin/settings/statuses`);
    revalidatePath(`/admin/properties`);
    return status;
  } catch (error) {
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }
}

export async function deleteStatusAction(id: string) {
  try {
    await statusService.deleteStatus(id);
    revalidatePath(`/admin/settings/statuses`);
    revalidatePath(`/admin/properties`);
    return true;
  } catch (error) {
    console.error('Error deleting status:', error);
    // In Prisma, attempting to delete a status linked to a property will throw an error
    throw new Error('Failed to delete status. It might be currently assigned to one or more units.');
  }
}
