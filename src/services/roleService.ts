import prisma from '@/lib/prisma';

export const RoleService = {
  async getRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true }
        },
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  },

  async getPermissions() {
    return prisma.permission.findMany({
      orderBy: { module: 'asc' }
    });
  },

  async createRole(name: string, description: string) {
    return prisma.role.create({
      data: { name, description }
    });
  },

  async updateRole(id: string, name: string, description: string) {
    return prisma.role.update({
      where: { id },
      data: { name, description }
    });
  },

  async deleteRole(id: string) {
    return prisma.role.delete({
      where: { id }
    });
  },

  async assignPermission(roleId: string, permissionId: string) {
    return prisma.rolePermission.create({
      data: { roleId, permissionId }
    });
  },

  async removePermission(roleId: string, permissionId: string) {
    return prisma.rolePermission.delete({
      where: {
        roleId_permissionId: { roleId, permissionId }
      }
    });
  }
};
