import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { ProjectForm } from '../ProjectForm';

export default function NewProjectPage() {
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
