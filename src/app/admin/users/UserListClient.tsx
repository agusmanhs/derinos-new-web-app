'use client';

import React, { useTransition } from 'react';
import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Badge } from '@/components/ui/Badge/Badge';
import { User } from '@/types/auth';
import { updateUserRoleAction } from '@/actions/adminUserActions';

interface Props {
  users: User[];
}

export const UserListClient: React.FC<Props> = ({ users }) => {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (id: string, newRole: User['role']) => {
    startTransition(async () => {
      try {
        await updateUserRoleAction(id, newRole);
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert('An unknown error occurred');
        }
      }
    });
  };

  const columns = [
    {
      header: 'User',
      accessor: (row: User) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src={row.avatar || ''} alt={row.name} width={32} height={32} style={{ borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong>{row.name}</strong>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (row: User) => {
        let variant: 'neutral' | 'success' | 'warning' | 'danger' = 'neutral';
        if (row.role === 'SUPER_ADMIN') variant = 'danger';
        if (row.role === 'MANAGEMENT') variant = 'warning';
        if (row.role === 'PROJECT_MANAGER' || row.role === 'SALES_MANAGER') variant = 'success';
        
        return <Badge variant={variant}>{row.role.replace('_', ' ')}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessor: (row: User) => (
        <select 
          value={row.role} 
          onChange={(e) => handleRoleChange(row.id, e.target.value as User['role'])}
          disabled={isPending}
          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '0.875rem' }}
        >
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="MANAGEMENT">Management</option>
          <option value="PROJECT_MANAGER">Project Manager</option>
          <option value="SALES_MANAGER">Sales Manager</option>
          <option value="SALES_AGENT">Sales Agent</option>
          <option value="CONTENT_MANAGER">Content Manager</option>
        </select>
      )
    }
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Users & Roles" 
        description="Manage system access and assign roles."
      />

      <AdminTable 
        columns={columns} 
        data={users} 
        keyExtractor={(row) => row.id} 
      />
    </div>
  );
};
