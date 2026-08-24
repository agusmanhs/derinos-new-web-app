import React from 'react';
import { CustomerService } from '@/services/customerService';
import { CustomerListClient } from './CustomerListClient';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function AdminCustomersPage() {
  const session = await verifySession();
  if (!session?.permissions.includes('manage_customers') && session?.roleName !== 'Super Admin') {
    redirect('/admin');
  }

  const customers = await CustomerService.getCustomers();

  return <CustomerListClient customers={customers} />;
}
