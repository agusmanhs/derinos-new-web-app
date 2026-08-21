'use client';

import React, { useTransition } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Badge } from '@/components/ui/Badge/Badge';
import { Sale } from '@/types/sale';
import { updateSaleStatusAction } from '@/actions/adminSalesActions';

interface Props {
  sales: Sale[];
}

export const SalesListClient: React.FC<Props> = ({ sales }) => {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: Sale['status']) => {
    startTransition(async () => {
      await updateSaleStatusAction(id, newStatus);
    });
  };

  const columns = [
    {
      header: 'Customer',
      accessor: (row: Sale) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.customer?.name || row.customerId}</strong>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Property',
      accessor: (row: Sale) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong>{row.projectTitle}</strong>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Unit {row.unitNumber}</span>
        </div>
      )
    },
    {
      header: 'Contract Value',
      accessor: (row: Sale) => `$${row.contractPrice.toLocaleString()}`
    },
    {
      header: 'Method',
      accessor: 'paymentMethod' as keyof Sale
    },
    {
      header: 'Status',
      accessor: (row: Sale) => {
        let variant: 'neutral' | 'success' | 'warning' | 'danger' = 'neutral';
        if (row.status === 'In Progress') variant = 'warning';
        if (row.status === 'Completed') variant = 'success';
        if (row.status === 'Cancelled') variant = 'danger';
        
        return <Badge variant={variant}>{row.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: (row: Sale) => (
        <select 
          value={row.status} 
          onChange={(e) => handleStatusChange(row.id, e.target.value as Sale['status'])}
          disabled={isPending}
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Sales & Transactions" 
        description="Monitor closed deals, contracts, and revenue."
      />

      <AdminTable 
        columns={columns} 
        data={sales} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No sales transactions found."
      />
    </div>
  );
};
