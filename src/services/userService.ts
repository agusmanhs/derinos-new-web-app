import prisma from '@/lib/prisma';
import { User } from '@/types/auth';

export const UserService = {
  async getUsers() {
    const users = await prisma.user.findMany({
      include: {
        role: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        permissions: [] // Not needed for list view
      } : null,
      avatar: user.avatar || undefined,
    })) as User[];
  },

  async createUser(data: Omit<User, 'id' | 'role' | 'avatar'> & { password: string }) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password, // TODO: Hash password in production
        roleId: data.roleId
      },
      include: { role: true }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        permissions: [] 
      } : null,
      avatar: user.avatar || undefined,
    } as User;
  },

  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'role'>>) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email?.toLowerCase(),
        roleId: data.roleId,
        avatar: data.avatar
      },
      include: { role: true }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
        permissions: [] 
      } : null,
      avatar: user.avatar || undefined,
    } as User;
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  }
};
