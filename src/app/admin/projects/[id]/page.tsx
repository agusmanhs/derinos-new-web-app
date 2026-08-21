import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { PropertyService } from '@/services/propertyService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { ProjectDashboardClient } from './ProjectDashboardClient';
import { statusService } from '@/services/statusService';

export default async function ViewProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let project = await ProjectService.getProjectBySlug(params.id);
  if (!project) {
    project = await ProjectService.getProjectById(params.id);
  }

  if (!project) {
    notFound();
  }
  
  const { data: properties } = await PropertyService.getProperties({ project: project.title }, undefined, 1, 100);
  const statuses = await statusService.getStatusesByProject(project.id);

  return (
    <div>
      <AdminPageHeader 
        title={project.title} 
        description={`Status: ${project.status} | Location: ${project.location}`}
      />
      
      <ProjectDashboardClient project={project} properties={properties} statuses={statuses} />
    </div>
  );
}
