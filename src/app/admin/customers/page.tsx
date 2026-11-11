import React from 'react';
import { CustomerService } from '@/services/customerService';
import { CustomerListClient } from './CustomerListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await requirePermission(['manage_customers']);

  const resolvedParams = await searchParams;
  const pageParam = resolvedParams?.page;
  const page = pageParam && !Array.isArray(pageParam) ? parseInt(pageParam as string, 10) : 1;
  const query = resolvedParams?.q && !Array.isArray(resolvedParams.q) ? (resolvedParams.q as string) : '';

  const { data: customers, ...pagination } = await CustomerService.getCustomers(query, page, 10);

  return <CustomerListClient customers={customers} pagination={pagination} />;
}
