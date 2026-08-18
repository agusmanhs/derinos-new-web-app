import React from 'react';
import { ProjectService } from '@/services/projectService';
import { ConstructionListClient } from './ConstructionListClient';

export default async function AdminConstructionPage() {
  const result = await ProjectService.getProjects({}, false); // Don't filter out archived if we want to manage them, or maybe we do. Let's say we only manage active projects' construction.

  return <ConstructionListClient projects={result} />;
}
