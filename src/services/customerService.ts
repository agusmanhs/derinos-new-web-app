import prisma from '@/lib/prisma';
import { Customer, Prisma } from '../../generated/prisma/client';

export interface PaginatedCustomerResult {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const CustomerService = {
  async getCustomers(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedCustomerResult> {
    const where: Prisma.CustomerWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const total = await prisma.customer.count({ where });
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: start,
      take: limit,
      include: {
        properties: { select: { id: true, unitNumber: true, projectTitle: true } },
        bookings: { select: { id: true, unitNumber: true, projectTitle: true, status: true } },
      },
    });

    return {
      data: customers,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        properties: {
          include: { project: { select: { title: true } }, phase: { select: { name: true } }, propertyStatus: true }
        },
        bookings: {
          include: { project: { select: { title: true } } }
        },
        sales: {
          include: { booking: { select: { projectTitle: true } } }
        }
      },
    });
  },

  async createCustomer(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return prisma.customer.create({
      data,
    });
  },

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data,
    });
  },

  async deleteCustomer(id: string): Promise<Customer> {
    return prisma.customer.delete({
      where: { id },
    });
  }
};
