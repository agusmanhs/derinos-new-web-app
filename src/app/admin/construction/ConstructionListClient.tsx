'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button/Button';
import { Project } from '@/types/project';

interface Props {
  projects: Project[];
}

export const ConstructionListClient: React.FC<Props> = ({ projects }) => {
  const router = useRouter();

  const columns = [
    {
      header: 'Project',
      accessor: (row: Project) => <strong>{row.title}</strong>
    },
    {
      header: 'Target Completion',
      accessor: (row: Project) => row.targetCompletion
    },
    {
      header: 'Progress',
      accessor: (row: Project) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
            <div style={{ width: `${row.overallProgress}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '3px' }}></div>
          </div>
          <span style={{ fontSize: '0.875rem' }}>{row.overallProgress}%</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Project) => (
        <Button variant="outlined" onClick={() => router.push(`/admin/construction/${row.id}`)}>Update Progress</Button>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Construction Management" 
        description="Track and update the construction progress of active projects."
      />

      <AdminTable 
        columns={columns} 
        data={projects} 
        keyExtractor={(row) => row.id} 
        emptyMessage="No active projects found."
      />
    </div>
  );
};
