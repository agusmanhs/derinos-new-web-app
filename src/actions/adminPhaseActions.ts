'use server';

import { PhaseService } from '@/services/phaseService';
import { ProjectPhase } from '@/types/project';
import { revalidatePath } from 'next/cache';

export async function createPhaseAction(data: Omit<ProjectPhase, 'id' | 'createdAt' | 'updatedAt' | 'properties'>, projectSlug: string) {
  try {
    const phase = await PhaseService.createPhase(data);
    
    // Revalidate the project page
    revalidatePath(`/admin/projects/${projectSlug}`);
    revalidatePath(`/admin/projects/${data.projectId}`);
    
    return { success: true, phase };
  } catch (error: any) {
    console.error('Failed to create phase:', error);
    return { success: false, message: error.message || 'Failed to create phase' };
  }
}
export async function deletePhaseAction(phaseId: string, projectId: string, projectSlug: string) {
  try {
    const success = await PhaseService.deletePhase(phaseId);
    if (success) {
      revalidatePath(`/admin/projects/${projectSlug}`);
      revalidatePath(`/admin/projects/${projectId}`);
      return { success: true };
    }
    return { success: false, message: 'Failed to delete phase' };
  } catch (error: any) {
    console.error('Failed to delete phase:', error);
    return { success: false, message: error.message || 'Failed to delete phase' };
  }
}

export async function updatePhaseAction(phaseId: string, data: Partial<ProjectPhase>, projectId: string, projectSlug: string) {
  try {
    const phase = await PhaseService.updatePhase(phaseId, data);
    if (phase) {
      revalidatePath(`/admin/projects/${projectSlug}`);
      revalidatePath(`/admin/projects/${projectId}`);
      return { success: true, phase };
    }
    return { success: false, message: 'Failed to update phase' };
  } catch (error: any) {
    console.error('Failed to update phase:', error);
    return { success: false, message: error.message || 'Failed to update phase' };
  }
}
