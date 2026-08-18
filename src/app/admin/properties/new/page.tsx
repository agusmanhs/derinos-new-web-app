import React from 'react';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { PropertyForm } from '../PropertyForm';

export default async function NewPropertyPage() {
  // Fetch projects to populate the dropdown
  const projects = await ProjectService.getProjects({}, false);

  return (
    <div>
      <AdminPageHeader 
        title="New Unit" 
        description="Add a new property unit to an existing project."
      />
      <PropertyForm projects={projects} />
    </div>
  );
}
