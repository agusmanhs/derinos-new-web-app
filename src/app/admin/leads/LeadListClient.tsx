'use client';

import React, { useTransition } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Badge } from '@/components/ui/Badge/Badge';
import { Lead } from '@/types/lead';
import { updateLeadStatusAction } from '@/actions/adminLeadActions';

interface Props {
  leads: Lead[];
}

export const LeadListClient: React.FC<Props> = ({ leads }) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: Lead['status']) => {
    startTransition(async () => {
      await updateLeadStatusAction(id, newStatus);
    });
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row: Lead) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.name}</strong>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: (row: Lead) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{row.email}</span>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.phone}</span>
        </div>
      )
    },
    {
      header: 'Interest',
      accessor: (row: Lead) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.project}</strong>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.propertyType}</span>
        </div>
      )
    },
    {
      header: 'Source',
      accessor: 'source' as keyof Lead
    },
    {
      header: 'Status',
      accessor: (row: Lead) => {
        let variant: 'neutral' | 'success' | 'warning' | 'danger' = 'neutral';
        if (row.status === 'New') variant = 'neutral';
        if (row.status === 'Contacted') variant = 'warning';
        if (row.status === 'Qualified') variant = 'success';
        if (row.status === 'Lost') variant = 'danger';
        
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: (row: Lead) => (
        <select 
          value={row.status || 'New'} 
          onChange={(e) => handleStatusChange(row.id, e.target.value as Lead['status'])}
          disabled={isPending}
          style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="CRM & Leads" 
        description="Manage incoming property inquiries and lead statuses."
      />

      <AdminTable 
        columns={columns} 
        data={leads} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No leads found."
      />
    </div>
  );
};
