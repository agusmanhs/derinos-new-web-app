'use server';

import { LeadService } from '@/services/leadService';
import { ActionResponse, LeadSubmissionPayload } from '@/types/lead';

export async function submitLead(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const project = formData.get('project') as string;
  const propertyType = formData.get('propertyType') as string;
  const budget = formData.get('budget') as string;
  const message = formData.get('message') as string;
  const source = formData.get('source') as string;
  const campaign = formData.get('campaign') as string;

  const errors: Record<string, string> = {};

  // Server-side validation
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }
  
  if (!phone || phone.trim().length < 8) {
    errors.phone = 'Valid phone number is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Valid email address is required.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const payload: LeadSubmissionPayload = {
      name,
      phone,
      email,
      project: project || '',
      propertyType: propertyType || '',
      budget: budget || '',
      message: message || '',
      source: source || 'Unknown',
      campaign: campaign || '',
    };

    await LeadService.createLead(payload);

    return { 
      success: true, 
      message: 'Thank you! Our sales team will contact you shortly.' 
    };
  } catch (error) {
    console.error('Error submitting lead:', error);
    return {
      success: false,
      message: 'Failed to submit form. Please try again later.'
    };
  }
}
