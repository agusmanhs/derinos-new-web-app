import prisma from '@/lib/prisma';
import { MarketingAgency, Commission } from '../../generated/prisma/client';

export const MarketingService = {
  async getAgencies(searchQuery?: string, page: number = 1, limit: number = 10) {
    const where = searchQuery ? {
      OR: [
        { name: { contains: searchQuery, mode: 'insensitive' as const } },
        { picName: { contains: searchQuery, mode: 'insensitive' as const } },
      ]
    } : {};

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.marketingAgency.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { bookings: true, sales: true }
          }
        }
      }),
      prisma.marketingAgency.count({ where })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  async getAgencyById(id: string) {
    return prisma.marketingAgency.findUnique({
      where: { id },
      include: {
        commissions: {
          include: {
            booking: true,
            sale: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },

  async createAgency(data: Partial<MarketingAgency>) {
    return prisma.marketingAgency.create({
      data: {
        name: data.name!,
        picName: data.picName,
        phone: data.phone,
        email: data.email,
        bankInfo: data.bankInfo
      }
    });
  },

  async updateAgency(id: string, data: Partial<MarketingAgency>) {
    return prisma.marketingAgency.update({
      where: { id },
      data
    });
  },

  async deleteAgency(id: string) {
    return prisma.marketingAgency.delete({
      where: { id }
    });
  },

  async updateCommission(id: string, data: Partial<Commission>) {
    return prisma.commission.update({
      where: { id },
      data
    });
  }
};
