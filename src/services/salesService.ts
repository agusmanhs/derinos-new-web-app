import { Sale } from '@/types/sale';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const SalesService = {
  async getSales(): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      orderBy: { date: 'desc' }
    });
    return sales.map(s => ({
      ...s,
      date: s.date.toISOString()
    })) as unknown as Sale[];
  },

  async updateSaleStatus(id: string, status: Sale['status']): Promise<Sale | null> {
    try {
      const sale = await prisma.sale.update({
        where: { id },
        data: { status }
      });
      return {
        ...sale,
        date: sale.date.toISOString()
      } as unknown as Sale;
    } catch {
      return null;
    }
  }
};
