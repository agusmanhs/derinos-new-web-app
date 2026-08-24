import React from 'react';
import { MarketingService } from '@/services/marketingService';
import { AgencyListClient } from './AgencyListClient';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminAgenciesPage() {
  const session = await verifySession();
  if (!session?.permissions.includes('manage_agencies') && session?.roleName !== 'Super Admin') {
    redirect('/admin');
  }

  const agencies = await MarketingService.getAgencies();

  return <AgencyListClient agencies={agencies} />;
}
