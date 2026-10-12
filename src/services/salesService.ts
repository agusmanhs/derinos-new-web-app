import { Sale } from '@/types/sale';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const SalesService = {
  async getSales(): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({
      orderBy: { date: 'desc' },
      include: {
        customer: true,
        agency: true,
        booking: {
          include: {
            propertyUnit: true
          }
        }
      }
    });
    return sales.map(s => ({
      ...s,
      date: s.date.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })) as unknown as Sale[];
  },

  async createOrUpdateSale(data: {
    bookingId: string;
    customerId: string;
    agencyId?: string | null;
    projectTitle: string;
    unitNumber: string;
    contractPrice: number;
    paymentMethod: 'Cash' | 'Mortgage' | 'Installment';
    status?: 'In Progress' | 'Completed' | 'Cancelled';
    notes?: string | null;
  }): Promise<Sale> {
    const status = data.status || 'In Progress';

    try {
      // Check if sale already exists for this bookingId
      const existing = await prisma.sale.findUnique({
        where: { bookingId: data.bookingId }
      });

      let saleRecord;
      if (existing) {
        saleRecord = await prisma.sale.update({
          where: { id: existing.id },
          data: {
            customerId: data.customerId,
            agencyId: data.agencyId !== undefined ? data.agencyId : existing.agencyId,
            contractPrice: data.contractPrice,
            paymentMethod: data.paymentMethod,
            status,
            projectTitle: data.projectTitle,
            unitNumber: data.unitNumber,
            notes: data.notes !== undefined ? data.notes : existing.notes
          },
          include: { customer: true, agency: true }
        });
      } else {
        saleRecord = await prisma.sale.create({
          data: {
            bookingId: data.bookingId,
            customerId: data.customerId,
            agencyId: data.agencyId || null,
            contractPrice: data.contractPrice,
            paymentMethod: data.paymentMethod,
            status,
            projectTitle: data.projectTitle,
            unitNumber: data.unitNumber,
            notes: data.notes || null
          },
          include: { customer: true, agency: true }
        });
      }

      // Also ensure booking status is Confirmed if it was Awaiting Payment
      await prisma.booking.update({
        where: { id: data.bookingId },
        data: { status: 'Confirmed' }
      });

      return {
        ...saleRecord,
        date: saleRecord.date.toISOString()
      } as unknown as Sale;
    } catch (error) {
      console.error('Error in SalesService.createOrUpdateSale:', error);
      throw error;
    }
  },

  async updateSaleStatus(id: string, status: Sale['status']): Promise<Sale | null> {
    try {
      const sale = await prisma.sale.update({
        where: { id },
        data: { status },
        include: { customer: true, agency: true }
      });
      return {
        ...sale,
        date: sale.date.toISOString(),
      } as unknown as Sale;
    } catch (error) {
      console.error('Error in SalesService.updateSaleStatus:', error);
      throw error;
    }
  }
};
