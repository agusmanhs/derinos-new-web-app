import React from 'react';
import { notFound } from 'next/navigation';
import { PropertyService } from '@/services/propertyService';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';

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
        description={`${property.projectTitle} - Status: ${property.status}`}
        action={
          <Link href={`/admin/properties/${property.id}/edit`}>
            <Button variant="primary">Edit Unit</Button>
          </Link>
        }
      />
      
      <div style={{ background: 'white', padding: '24px', border: '1px solid #e5e5e5' }}>
        <h3>Specifications</h3>
        <p><strong>Type:</strong> {property.typeName}</p>
        <p><strong>Price:</strong> Rp {property.price.toLocaleString('id-ID')}</p>
        <p><strong>Land Size:</strong> {property.landSize} sqm</p>
        <p><strong>Building Size:</strong> {property.buildingSize} sqm</p>
        <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
      </div>
    </div>
  );
}
