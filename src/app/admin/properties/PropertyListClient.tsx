'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { archivePropertyAction } from '@/actions/adminPropertyActions';
import { PropertyUnit } from '@/types/project';
import styles from './page.module.css';

interface Props {
  properties: PropertyUnit[];
}

export const PropertyListClient: React.FC<Props> = ({ properties }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleArchive = (id: string) => {
    if (confirm('Are you sure you want to archive this unit?')) {
      startTransition(async () => {
        await archivePropertyAction(id);
      });
    }
  };

  const columns = [
    {
      header: 'Unit',
      accessor: (row: PropertyUnit) => (
        <div className={styles.nameCell}>
          <strong>{row.unitNumber}</strong>
          <span>{row.projectTitle}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'typeName' as keyof PropertyUnit
    },
    {
      header: 'Price',
      accessor: (row: PropertyUnit) => `$${row.price.toLocaleString()}`
    },
    {
      header: 'Status',
      accessor: (row: PropertyUnit) => (
        <Badge variant={row.status === 'Available' ? 'success' : row.status === 'Reserved' ? 'warning' : 'neutral'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (row: PropertyUnit) => (
        <div className={styles.actionButtons}>
          <Button variant="outlined" onClick={() => router.push(`/admin/properties/${row.id}/edit`)}>Edit</Button>
          <Button variant="danger" disabled={isPending} onClick={() => handleArchive(row.id)}>Archive</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Properties & Units" 
        description="Manage individual property units across all projects."
        action={
          <Link href="/admin/properties/new">
            <Button variant="primary">+ New Unit</Button>
          </Link>
        }
      />

      <AdminTable 
        columns={columns} 
        data={properties} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No active units found."
      />
    </div>
  );
};
