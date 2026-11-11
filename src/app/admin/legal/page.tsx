import React from 'react';
import { LegalService } from '@/services/legalService';
import { LegalListClient } from './LegalListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminLegalPage() {
  await requirePermission(['manage_bookings']);
  const documents = await LegalService.getLegalDocuments();

  return <LegalListClient initialDocuments={documents} />;
}
