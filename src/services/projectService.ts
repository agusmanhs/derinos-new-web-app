import { Project } from '@/types/project';
import { mockProjects } from '@/lib/mockData';

export interface ProjectFilters {
  search?: string;
  location?: string;
  status?: string;
}

export const ProjectService = {
  /**
   * Fetch all projects, optionally filtered.
   */
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let results = [...mockProjects];

    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(p => p.title.toLowerCase().includes(query));
      }
      if (filters.location && filters.location !== 'All') {
        results = results.filter(p => p.location.includes(filters.location!));
      }
      if (filters.status && filters.status !== 'All') {
        results = results.filter(p => p.status === filters.status);
      }
    }

    return results;
  },

  /**
   * Fetch a single project by its slug.
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const project = mockProjects.find(p => p.slug === slug);
    return project || null;
  },
  
  /**
   * Extract unique locations for filter dropdowns.
   */
  async getLocations(): Promise<string[]> {
    const locations = Array.from(new Set(mockProjects.map(p => p.location)));
    return ['All', ...locations];
  },
  
  /**
   * Extract unique statuses for filter dropdowns.
   */
  async getStatuses(): Promise<string[]> {
    const statuses = Array.from(new Set(mockProjects.map(p => p.status)));
    return ['All', ...statuses];
  }
};
