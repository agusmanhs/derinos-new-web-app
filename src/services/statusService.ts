import prisma from '../lib/prisma';

export const statusService = {
  getStatuses: async () => {
    return await prisma.propertyStatus.findMany({
      orderBy: { order: 'asc' },
    });
  },

  createStatus: async (data: { name: string; colorHex: string; order?: number }) => {
    return await prisma.propertyStatus.create({
      data: {
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
