import React from 'react';
import { ProjectService } from '@/services/projectService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { PropertyForm } from '../PropertyForm';
import { CustomerService } from '@/services/customerService';
import { statusService } from '@/services/statusService';

export default async function NewPropertyPage() {
  // Fetch projects to populate the dropdown
  const [projects, paginatedCustomers, propertyStatuses] = await Promise.all([
    ProjectService.getProjects(),
    CustomerService.getCustomers(undefined, 1, 1000),
    statusService.getStatuses()
  ]);

  return (
    <div>
      <AdminPageHeader 
        title="New Unit" 
        description="Add a new property unit to the inventory."
        breadcrumbs={[
          { label: 'Units', href: '/admin/properties' },
          { label: 'New Unit' }
        ]}
      />
      <PropertyForm projects={projects} customers={paginatedCustomers.data} propertyStatuses={propertyStatuses} />
    </div>
  );
}
