import { Sale } from '@/types/sale';
import { mockSales } from '@/lib/mockSalesData';

export const SalesService = {
  async getSales(): Promise<Sale[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockSales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async updateSaleStatus(id: string, status: Sale['status']): Promise<Sale | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockSales.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    mockSales[index].status = status;
    return mockSales[index];
  }
};
