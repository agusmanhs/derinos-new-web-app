import React from 'react';
import { notFound } from 'next/navigation';
import { MarketingService } from '@/services/marketingService';
import { AgencyDetailClient } from './AgencyDetailClient';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';

export default async function AgencyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const agency = await MarketingService.getAgencyById(params.id);

  if (!agency) {
    notFound();
  }

  return (
    <div>
      <AdminPageHeader 
        title={`Agency: ${agency.name}`}
        description="View performance and manage commission payments."
        breadcrumbs={[
          { label: 'Agencies', href: '/admin/agencies' },
          { label: agency.name }
        ]}
      />
      
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Agency Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <strong>PIC:</strong> {agency.picName || '-'}
          </div>
          <div>
            <strong>Phone:</strong> {agency.phone || '-'}
          </div>
          <div>
            <strong>Email:</strong> {agency.email || '-'}
          </div>
          <div>
            <strong>Bank Info:</strong> {agency.bankInfo || '-'}
          </div>
        </div>
      </div>

      <AgencyDetailClient agency={agency} />
    </div>
  );
}
