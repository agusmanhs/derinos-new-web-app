import React from 'react';
import { CustomerService } from '@/services/customerService';
import { CustomerListClient } from './CustomerListClient';

export default async function AdminCustomersPage() {
  const customers = await CustomerService.getCustomers();

  return <CustomerListClient customers={customers} />;
}
