import React from 'react';
import { MarketingService } from '@/services/marketingService';
import { AgencyListClient } from './AgencyListClient';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminAgenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await verifySession();
  if (!session?.permissions.includes('manage_agencies') && session?.roleName !== 'Super Admin') {
    redirect('/admin');
  }

  const resolvedParams = await searchParams;
  const pageParam = resolvedParams?.page;
  const page = pageParam && !Array.isArray(pageParam) ? parseInt(pageParam as string, 10) : 1;
  const query = resolvedParams?.q && !Array.isArray(resolvedParams.q) ? (resolvedParams.q as string) : '';

  const { data: agencies, ...pagination } = await MarketingService.getAgencies(query, page, 10);

  return <AgencyListClient agencies={agencies} pagination={pagination} />;
}
