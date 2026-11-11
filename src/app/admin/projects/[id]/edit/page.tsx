import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { ProjectForm } from '../../ProjectForm';
import { requirePermission } from '@/lib/authGuard';

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  await requirePermission(['manage_projects']);
  const params = await props.params;
  let project = await ProjectService.getProjectBySlug(params.id);
  if (!project) {
    project = await ProjectService.getProjectById(params.id);
  }

  if (!project) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader 
        title="Edit Project" 
        description={`Editing: ${project.title}`}
      />
      <ProjectForm project={project} />
    </div>
  );
}
