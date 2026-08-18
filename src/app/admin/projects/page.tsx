import React from 'react';
import { ProjectService } from '@/services/projectService';
import { ProjectListClient } from './ProjectListClient';

export default async function AdminProjectsPage() {
  const projects = await ProjectService.getProjects({}, false); // Don't include archived

  return <ProjectListClient projects={projects} />;
}
