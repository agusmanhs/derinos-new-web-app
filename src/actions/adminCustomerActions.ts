'use server';

import { revalidatePath } from 'next/cache';
import { CustomerService } from '@/services/customerService';
import { assertActionPermission } from '@/lib/authGuard';

export async function createCustomerAction(formData: FormData) {
  const auth = await assertActionPermission(['manage_customers']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  const name = formData.get('name') as string;
  if (!name) throw new Error('Name is required');

  const customer = await CustomerService.createCustomer({
    name,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    ktpNumber: (formData.get('ktpNumber') as string) || null,
    npwp: (formData.get('npwp') as string) || null,
  });

  revalidatePath('/admin/customers');
  return customer;
}

export async function updateCustomerAction(id: string, formData: FormData) {
  const auth = await assertActionPermission(['manage_customers']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  const name = formData.get('name') as string;
  if (!name) throw new Error('Name is required');

  const customer = await CustomerService.updateCustomer(id, {
    name,
    email: (formData.get('email') as string) || null,
    phone: (formData.get('phone') as string) || null,
    address: (formData.get('address') as string) || null,
    ktpNumber: (formData.get('ktpNumber') as string) || null,
    npwp: (formData.get('npwp') as string) || null,
  });

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${id}`);
  return customer;
}

export async function deleteCustomerAction(id: string) {
  const auth = await assertActionPermission(['manage_customers']);
  if (!auth.authorized) {
    throw new Error(auth.message);
  }

  await CustomerService.deleteCustomer(id);
  revalidatePath('/admin/customers');
}
