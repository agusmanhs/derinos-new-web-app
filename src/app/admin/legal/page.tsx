import React from 'react';
import { LegalService } from '@/services/legalService';
import { LegalListClient } from './LegalListClient';

export default async function AdminLegalPage() {
  const documents = await LegalService.getLegalDocuments();

  return <LegalListClient initialDocuments={documents} />;
}
