export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  project?: string;
  propertyType?: string;
  budget?: string;
  message: string;
  
  // Source Tracking
  source: string; // e.g., 'Homepage', 'Project Detail', 'Property Detail'
  campaign?: string; // UTM params if available
  
  // CRM Tracking
  status?: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  
  createdAt: string;
}

export interface LeadSubmissionPayload {
  name: string;
  phone: string;
  email: string;
  project: string;
  propertyType: string;
  budget: string;
  message: string;
  source: string;
  campaign: string;
}

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}
