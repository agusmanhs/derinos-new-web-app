import prisma from '../lib/prisma';

export const statusService = {
  getStatusesByProject: async (projectId: string) => {
    return await prisma.propertyStatus.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  },

  getStatuses: async () => {
    return await prisma.propertyStatus.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createStatus: async (data: { projectId: string; name: string; colorHex: string; order?: number }) => {
    return await prisma.propertyStatus.create({
      data: {
        projectId: data.projectId,
        name: data.name,
        colorHex: data.colorHex,
        order: data.order ?? 0,
      }
    });
  },

  updateStatus: async (id: string, data: { name?: string; colorHex?: string; order?: number }) => {
    return await prisma.propertyStatus.update({
      where: { id },
      data
    });
  },

  deleteStatus: async (id: string) => {
    return await prisma.propertyStatus.delete({
      where: { id }
    });
  }
};
