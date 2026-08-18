import { Lead, LeadSubmissionPayload } from '@/types/lead';

export const LeadService = {
  /**
   * Save lead to database/CRM.
   * Currently mocked to simulate backend latency and abstract logic.
   */
  async createLead(payload: LeadSubmissionPayload): Promise<Lead> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Here we would normally use Prisma or fetch() to an external CRM
    // e.g. await prisma.lead.create({ data: payload })

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };

    console.log('[LeadService] New lead saved:', newLead);

    return newLead;
  }
};
