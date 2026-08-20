import { User } from '@/types/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const AuthService = {
  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    // Simplistic password check (no hashing for now as per mock)
    // We assume password should be at least 4 chars long or match something.
    // In production, we'd use bcrypt to compare password hash.
    if (user && password.length >= 4) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
      } as User;
    }
    return null;
  },

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
    } as User;
  },

  async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
    })) as User[];
  },

  async updateUserRole(id: string, role: User['role']): Promise<User | null> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { role }
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || undefined,
      } as User;
    } catch {
      return null;
    }
  }
};
