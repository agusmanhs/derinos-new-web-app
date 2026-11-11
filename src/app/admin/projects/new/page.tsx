import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { ProjectForm } from '../ProjectForm';
import { requirePermission } from '@/lib/authGuard';

export default async function NewProjectPage() {
  await requirePermission(['manage_projects']);
  return (
    <div>
      <AdminPageHeader 
        title="New Project" 
        description="Add a new development project to your portfolio."
      />
      <ProjectForm />
    </div>
  );
}
