import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectService } from '@/services/projectService';
import { PropertyService } from '@/services/propertyService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { ProjectDashboardClient } from './ProjectDashboardClient';
import { statusService } from '@/services/statusService';
import { requirePermission } from '@/lib/authGuard';
import { MarketingService } from '@/services/marketingService';
import { CustomerService } from '@/services/customerService';

export default async function ViewProjectPage(props: { params: Promise<{ id: string }> }) {
  const ctx = await requirePermission([
    'view_projects',
    'manage_projects',
    'update_unit_status',
    'update_construction_progress',
  ]);
  const params = await props.params;
  let project = await ProjectService.getProjectBySlug(params.id);
  if (!project) {
    project = await ProjectService.getProjectById(params.id);
  }
  
  if (!project) {
    notFound();
  }
  
  const { data: properties } = await PropertyService.getProperties({ project: project.title }, undefined, 1, 1000);
  const statuses = await statusService.getStatuses();
  
  const [paginatedCustomers, paginatedAgencies] = await Promise.all([
    CustomerService.getCustomers(undefined, 1, 1000),
    MarketingService.getAgencies(undefined, 1, 1000)
  ]);

  const isSuperAdmin = ctx.isSuperAdmin;
  const userPermissions = ctx.permissions;
  const canManageProjects = isSuperAdmin || userPermissions.includes('manage_projects');
  const canUpdateStatus = isSuperAdmin || canManageProjects || userPermissions.includes('update_unit_status');
  const canUpdateProgress = isSuperAdmin || canManageProjects || userPermissions.includes('update_construction_progress');

  return (
    <div>
      <AdminPageHeader 
        title={project.title} 
        description={`Status: ${project.status} | Location: ${project.location}`}
      />
      
      <ProjectDashboardClient 
        project={project} 
        properties={properties} 
        statuses={statuses} 
        customers={paginatedCustomers.data}
        agencies={paginatedAgencies.data}
        canManageProjects={canManageProjects} 
        canUpdateStatus={canUpdateStatus}
        canUpdateProgress={canUpdateProgress}
      />
    </div>
  );
}
