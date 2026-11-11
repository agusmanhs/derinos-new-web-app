import React from 'react';
import { ProjectService } from '@/services/projectService';
import { ProjectListClient } from './ProjectListClient';
import { requirePermission } from '@/lib/authGuard';

export default async function AdminProjectsPage() {
  await requirePermission(['view_projects', 'manage_projects', 'update_construction_progress', 'update_unit_status']);
  const projects = await ProjectService.getProjects({}, false); // Don't include archived

  return <ProjectListClient projects={projects} />;
}
