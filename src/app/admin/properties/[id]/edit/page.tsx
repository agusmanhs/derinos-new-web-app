import React from 'react';
import { notFound } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { PropertyForm } from '../../PropertyForm';

export default async function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const property = await PropertyService.getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  const projects = await ProjectService.getProjects({}, false);

  return (
    <div>
      <AdminPageHeader 
        title="Edit Unit" 
        description={`Editing Unit: ${property.unitNumber}`}
      />
      <PropertyForm property={property} projects={projects} />
    </div>
  );
}
