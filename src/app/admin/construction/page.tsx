import React from 'react';
import { PropertyService } from '@/services/propertyService';
import { ProjectService } from '@/services/projectService';
import { ConstructionListClient } from './ConstructionListClient';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import { redirect } from 'next/navigation';

export default async function AdminConstructionPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await verifySession();
  if (!session) {
    redirect('/login');
  }

  let userPermissions: string[] = session.permissions || [];
  let roleName = session.roleName || '';
  if (session.userId) {
    const liveUser = await AuthService.getUserById(session.userId);
    if (liveUser?.role) {
      roleName = liveUser.role.name;
      userPermissions = liveUser.role.permissions || [];
    }
  }

  const isSuperAdmin = roleName === 'Super Admin';
  const canView =
    isSuperAdmin ||
    userPermissions.includes('view_projects') ||
    userPermissions.includes('manage_projects') ||
    userPermissions.includes('update_construction_progress');

  if (!canView) {
    redirect('/admin');
  }

  const canUpdateProgress =
    isSuperAdmin ||
    userPermissions.includes('manage_projects') ||
    userPermissions.includes('update_construction_progress');

  const searchParams = await props.searchParams;
  const page = parseInt(searchParams.page || '1');
  const q = searchParams.q || '';
  const project = searchParams.project || '';
  const phase = searchParams.phase || '';
  const status = searchParams.status || '';
  const progress = searchParams.progress || '';
  const sort = searchParams.sort || 'progress_desc';

  const filters = {
    search: q,
    project,
    phaseId: phase,
    statusId: status,
    progressStatus: progress,
  };

  const [result, filterOptions, stats, projects] = await Promise.all([
    PropertyService.getProperties(filters, sort, page, 15),
    PropertyService.getFilterOptions(),
    PropertyService.getConstructionStats({
      project: filters.project,
      phaseId: filters.phaseId,
    }),
    ProjectService.getProjects({}, false),
  ]);

  return (
    <ConstructionListClient
      properties={result.data}
      pagination={{
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
        limit: result.limit,
      }}
      filterOptions={filterOptions}
      stats={stats}
      projects={projects}
      canUpdateProgress={canUpdateProgress}
    />
  );
}
