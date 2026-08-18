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
  async getProjects(filters?: ProjectFilters, includeArchived = false): Promise<Project[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let results = mockProjects.filter(p => includeArchived ? true : !p.archived);

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
  },

  /**
   * Create a new project.
   */
  async createProject(data: Partial<Project>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newProject = {
      ...data,
      id: `prj-${Date.now()}`,
      archived: false,
    } as Project;
    mockProjects.push(newProject);
    return newProject;
  },

  /**
   * Update an existing project.
   */
  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProjects[index] = { ...mockProjects[index], ...data };
    return mockProjects[index];
  },

  /**
   * Archive a project (soft delete).
   */
  async archiveProject(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProjects[index].archived = true;
    return true;
  },

  /**
   * Get a project by its exact ID (useful for Admin Edit).
   */
  async getProjectById(id: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProjects.find(p => p.id === id) || null;
  }
};
