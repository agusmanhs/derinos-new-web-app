import { Lead, LeadSubmissionPayload } from '@/types/lead';
import { mockLeads } from '@/lib/mockLeadData';

export const LeadService = {
  /**
   * Save lead to database/CRM.
   * Currently mocked to simulate backend latency and abstract logic.
   */
  async createLead(payload: LeadSubmissionPayload): Promise<Lead> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...payload,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    mockLeads.push(newLead);
    console.log('[LeadService] New lead saved:', newLead);

    return newLead;
  },

  async getLeads(): Promise<Lead[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Return sorted by newest first
    return [...mockLeads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getLeadById(id: string): Promise<Lead | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockLeads.find(l => l.id === id) || null;
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    mockLeads[index].status = status;
    return mockLeads[index];
  }
};
