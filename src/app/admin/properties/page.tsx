import React from 'react';
import { PropertyService } from '@/services/propertyService';
import { PropertyListClient } from './PropertyListClient';

export default async function AdminPropertiesPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  
  const page = parseInt(searchParams.page || '1');
  const q = searchParams.q || '';
  const project = searchParams.project || '';
  const type = searchParams.type || '';
  const status = searchParams.status || '';

  const filters = {
    search: q,
    project: project,
    type: type,
    statusId: status
  };

  const [result, filterOptions] = await Promise.all([
    PropertyService.getProperties(filters, undefined, page, 10),
    PropertyService.getFilterOptions()
  ]);

  return (
    <PropertyListClient 
      properties={result.data} 
      pagination={{
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
        limit: result.limit
      }}
      filterOptions={filterOptions}
    />
  );
}
