import React from 'react';
import { SalesService } from '@/services/salesService';
import { SalesListClient } from './SalesListClient';

export default async function AdminSalesPage() {
  const sales = await SalesService.getSales();

  return <SalesListClient sales={sales} />;
}
