import React from 'react';
import { LeadService } from '@/services/leadService';
import { LeadListClient } from './LeadListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminLeadsPage() {
  await requirePermission(['view_leads', 'manage_leads']);
  const leads = await LeadService.getLeads();

  return <LeadListClient leads={leads} />;
}
