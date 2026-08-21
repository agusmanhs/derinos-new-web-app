import React from 'react';
import { notFound } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { PropertyForm } from '../../PropertyForm';
import { CustomerService } from '@/services/customerService';
import { statusService } from '@/services/statusService';

export default async function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [property, projects, customers, propertyStatuses] = await Promise.all([
    PropertyService.getPropertyById(params.id),
    ProjectService.getProjects(),
    CustomerService.getCustomers(),
    statusService.getStatuses()
  ]);

  if (!property) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader 
        title="Edit Unit" 
        description={`Update details for ${property.unitNumber}`}
        breadcrumbs={[
          { label: 'Units', href: '/admin/properties' },
          { label: 'Edit' }
        ]}
      />
      <PropertyForm property={property} projects={projects} customers={customers} propertyStatuses={propertyStatuses} />
    </div>
  );
}
