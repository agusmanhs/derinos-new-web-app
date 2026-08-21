import React from 'react';
import { MarketingService } from '@/services/marketingService';
import { AgencyListClient } from './AgencyListClient';

export default async function AdminAgenciesPage() {
  const agencies = await MarketingService.getAgencies();

  return <AgencyListClient agencies={agencies} />;
}
