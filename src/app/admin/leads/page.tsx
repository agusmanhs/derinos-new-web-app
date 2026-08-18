import React from 'react';
import { LeadService } from '@/services/leadService';
import { LeadListClient } from './LeadListClient';

export default async function AdminLeadsPage() {
  const leads = await LeadService.getLeads();

  return <LeadListClient leads={leads} />;
}
