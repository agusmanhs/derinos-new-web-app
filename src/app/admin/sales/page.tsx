import React from 'react';
import { SalesService } from '@/services/salesService';
import { SalesListClient } from './SalesListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminSalesPage() {
  await requirePermission(['manage_bookings']);
  const sales = await SalesService.getSales();

  return <SalesListClient sales={sales} />;
}
