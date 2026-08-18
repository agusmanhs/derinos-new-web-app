import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { ConstructionForm } from './ConstructionForm';

export default async function AdminConstructionManagePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await ProjectService.getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader 
        title={`Update Progress: ${project.title}`} 
        description="Update overall completion, target dates, and phase statuses."
      />
      <ConstructionForm project={project} />
    </div>
  );
}
