import prisma from '@/lib/prisma';
import { ProjectPhase } from '@/types/project';

export const PhaseService = {
  async getPhasesByProjectId(projectId: string): Promise<ProjectPhase[]> {
    const phases = await prisma.projectPhase.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' }
    });
    
    return phases.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  },

  async getPhaseById(id: string): Promise<ProjectPhase | null> {
    const phase = await prisma.projectPhase.findUnique({
      where: { id }
    });
    
    if (!phase) return null;
    
    return {
      ...phase,
      createdAt: phase.createdAt.toISOString(),
      updatedAt: phase.updatedAt.toISOString(),
    };
  },

  async createPhase(data: Omit<ProjectPhase, 'id' | 'createdAt' | 'updatedAt' | 'properties'>): Promise<ProjectPhase> {
    const phase = await prisma.projectPhase.create({
      data: {
        name: data.name,
        projectId: data.projectId,
        description: data.description,
        sitePlanSvg: data.sitePlanSvg,
        status: data.status,
        order: data.order,
      }
    });
    
    return {
      ...phase,
      createdAt: phase.createdAt.toISOString(),
      updatedAt: phase.updatedAt.toISOString(),
    };
  },

  async updatePhase(id: string, data: Partial<ProjectPhase>): Promise<ProjectPhase | null> {
    try {
      const phase = await prisma.projectPhase.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          sitePlanSvg: data.sitePlanSvg,
          status: data.status,
          order: data.order,
        }
      });
      
      return {
        ...phase,
        createdAt: phase.createdAt.toISOString(),
        updatedAt: phase.updatedAt.toISOString(),
      };
    } catch {
      return null;
    }
  },

  async deletePhase(id: string): Promise<boolean> {
    try {
      await prisma.projectPhase.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }
};
