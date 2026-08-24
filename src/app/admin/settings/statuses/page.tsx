import React from 'react';
import { getProjectStatuses } from '@/actions/adminStatusActions';
import { StatusListClient } from './StatusListClient';

export const metadata = {
  title: 'Property Statuses | Derinos',
};

export default async function StatusesPage() {
  const statuses = await getProjectStatuses();

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px', color: '#111827' }}>Unit Statuses</h1>
      <p style={{ color: '#4B5563', marginBottom: '24px' }}>Manage the master statuses and colors for all units across all projects.</p>
      
      <StatusListClient initialStatuses={statuses} />
    </div>
  );
}
