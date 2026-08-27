import React from 'react';
import { notFound } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
import { PropertyDetailClient } from './PropertyDetailClient';

export default async function ViewPropertyPage(props: { params: Promise<{ id: string }> }) {
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
          <Link href={`/admin/properties/${property.id}/edit`}>
            <Button variant="primary">Edit Unit</Button>
          </Link>
        }
      />
      
      <PropertyDetailClient property={property} />
    </div>
  );
}
