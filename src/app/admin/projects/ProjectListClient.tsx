'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import { archiveProjectAction } from '@/actions/adminProjectActions';
import { Project } from '@/types/project';
import styles from './page.module.css';

interface Props {
  projects: Project[];
}

export const ProjectListClient: React.FC<Props> = ({ projects }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleArchive = (id: string) => {
    if (confirm('Are you sure you want to archive this project?')) {
      startTransition(async () => {
        await archiveProjectAction(id);
      });
    }
  };

  const columns = [
    {
      header: 'Project Name',
      accessor: (row: Project) => (
        <div className={styles.nameCell}>
          <strong>{row.title}</strong>
          <span>{row.slug}</span>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location' as keyof Project
    },
    {
      header: 'Status',
      accessor: (row: Project) => (
        <Badge variant={row.status === 'Ready to Move' ? 'success' : row.status === 'Pre-Selling' ? 'warning' : 'neutral'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (row: Project) => (
        <div className={styles.actionButtons}>
          <Button variant="outlined" onClick={() => router.push(`/admin/projects/${row.id}/edit`)}>Edit</Button>
          <Button variant="danger" disabled={isPending} onClick={() => handleArchive(row.id)}>Archive</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Projects" 
        description="Manage your property developments."
        action={
          <Link href="/admin/projects/new">
            <Button variant="primary">+ New Project</Button>
          </Link>
        }
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
