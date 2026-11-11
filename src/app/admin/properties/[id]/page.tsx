import React from 'react';
import { notFound } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
import { PropertyDetailClient } from './PropertyDetailClient';
import { requirePermission } from '@/lib/authGuard';

export default async function ViewPropertyPage(props: { params: Promise<{ id: string }> }) {
  const ctx = await requirePermission(['view_projects', 'manage_projects']);
  const canManageProjects = ctx.isSuperAdmin || ctx.permissions.includes('manage_projects');
  const params = await props.params;
  const property = await PropertyService.getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader 
        title={`Unit ${property.unitNumber}`} 
        description={`${property.project?.title || 'Unknown Project'} - Phase: ${property.phase?.name || '-'}`}
        action={
          canManageProjects ? (
            <Link href={`/admin/properties/${property.id}/edit`}>
              <Button variant="primary">Edit Unit</Button>
            </Link>
          ) : undefined
        }
      />
      
      <PropertyDetailClient property={property} />
    </div>
  );
}
