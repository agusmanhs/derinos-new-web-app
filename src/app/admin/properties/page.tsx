import React from 'react';
import { PropertyService } from '@/services/propertyService';
import { PropertyListClient } from './PropertyListClient';

export default async function AdminPropertiesPage() {
  // Fetching a large limit for admin table for now (instead of paginating server-side in this mock)
  const result = await PropertyService.getProperties({}, undefined, 1, 100); 

  return <PropertyListClient properties={result.data} />;
}
