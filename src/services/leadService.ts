import { Lead, LeadSubmissionPayload } from '@/types/lead';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const LeadService = {
  /**
   * Save lead to database/CRM.
   */
  async createLead(payload: LeadSubmissionPayload): Promise<Lead> {
    const projectRecord = payload.project ? await prisma.project.findFirst({ where: { title: payload.project } }) : null;

    const lead = await prisma.lead.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message || '',
        source: payload.source || 'Website',
        propertyType: payload.propertyType || '',
        budget: payload.budget || '',
        campaign: payload.campaign || '',
        projectId: projectRecord?.id || null,
        status: 'New'
      }
    });

    console.log('[LeadService] New lead saved:', lead.id);

    return {
      ...lead,
      createdAt: lead.createdAt.toISOString()
    } as unknown as Lead;
  },

  async getLeads(): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return leads.map(l => ({
      ...l,
      createdAt: l.createdAt.toISOString()
    })) as unknown as Lead[];
  },

  async getLeadById(id: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return null;
    return {
      ...lead,
      createdAt: lead.createdAt.toISOString()
    } as unknown as Lead;
  },

  async updateLeadStatus(id: string, status: Lead['status']): Promise<Lead | null> {
    try {
      const lead = await prisma.lead.update({
        where: { id },
        data: { status }
      });
      return {
        ...lead,
        createdAt: lead.createdAt.toISOString()
      } as unknown as Lead;
    } catch {
      return null;
    }
  }
};
