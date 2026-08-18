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
   * Delete (hard delete) a project.
   */
  async deleteProject(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const initialLength = mockProjects.length;
    const filtered = mockProjects.filter(p => p.id !== id);
    if (filtered.length !== initialLength) {
      // In a real app we'd splice or reassigned, but since we export the array, we must splice it
      const index = mockProjects.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProjects.splice(index, 1);
        return true;
      }
    }
    return false;
  },

  /**
   * Helper methods for Homepage and UI
   */
  async getFeaturedProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProjects.filter(p => p.featured && !p.archived);
  },

  async getFacilities() {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Usually facilities are per-project, but we can aggregate distinct facilities or return a mock list for the homepage
    // Let's use the facilities from the first project as global showcase, or just a static list
    const defaultFacilities = mockProjects[0]?.facilities || [];
    return defaultFacilities;
  },

  async getGalleryImages() {
    await new Promise(resolve => setTimeout(resolve, 100));
    // Aggregate gallery images from all projects
    const allImages = mockProjects.filter(p => !p.archived).flatMap(p => p.gallery || []);
    // Return unique images up to 8 items
    return Array.from(new Set(allImages)).slice(0, 8);
  },

  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 100));
    const availableProjects = mockProjects.filter(p => !p.archived).length;
    const cities = new Set(mockProjects.filter(p => !p.archived).map(p => p.location.split(' ').pop())).size;
    return {
      yearsExperience: '15+',
      completedProjects: 24, // Mock static stat
      availableProjects,
      cities: cities > 0 ? cities : 4,
    };
  },

  async getProjectOptions(): Promise<{label: string, value: string}[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const activeProjects = mockProjects.filter(p => !p.archived);
    return [
      { label: 'Select Project', value: '' },
      ...activeProjects.map(p => ({
        label: p.title,
        value: p.title
      }))
    ];
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
  },

  /**
   * Update Construction Progress of a project.
   */
  async updateConstructionProgress(id: string, overallProgress: number, targetCompletion: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProjects[index].overallProgress = overallProgress;
    mockProjects[index].targetCompletion = targetCompletion;
    return mockProjects[index];
  }
};
