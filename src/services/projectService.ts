import { Project } from '@/types/project';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

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
    const where: Prisma.ProjectWhereInput = {
      archived: includeArchived ? undefined : false,
    };

    if (filters) {
      if (filters.search) {
        where.title = { contains: filters.search, mode: 'insensitive' };
      }
      if (filters.location && filters.location !== 'All') {
        where.location = { contains: filters.location, mode: 'insensitive' };
      }
      if (filters.status && filters.status !== 'All') {
        where.status = filters.status;
      }
    }

    const projects = await prisma.project.findMany({ 
      where,
      include: { phases: true }
    });
    // Safe cast because Prisma JSON fields return any, but we typed them in TS
    return projects.map(p => ({
      ...p,
      phases: p.phases.map(ph => ({
        ...ph,
        createdAt: ph.createdAt.toISOString(),
        updatedAt: ph.updatedAt.toISOString(),
      }))
    })) as unknown as Project[];
  },

  /**
   * Fetch a single project by its slug.
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({ 
      where: { slug },
      include: { phases: true }
    });
    if (!project) return null;
    return {
      ...project,
      phases: project.phases.map(ph => ({
        ...ph,
        createdAt: ph.createdAt.toISOString(),
        updatedAt: ph.updatedAt.toISOString(),
      }))
    } as unknown as Project;
  },
  
  /**
   * Extract unique locations for filter dropdowns.
   */
  async getLocations(): Promise<string[]> {
    const projects = await prisma.project.findMany({
      select: { location: true },
      distinct: ['location'],
    });
    return ['All', ...projects.map(p => p.location)];
  },
  
  /**
   * Extract unique statuses for filter dropdowns.
   */
  async getStatuses(): Promise<string[]> {
    const projects = await prisma.project.findMany({
      select: { status: true },
      distinct: ['status'],
    });
    return ['All', ...projects.map(p => p.status)];
  },

  /**
   * Create a new project.
   */
  async createProject(data: Partial<Project>): Promise<Project> {
    // Generate a slug if not provided
    const slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `prj-${Date.now()}`;
    
    // We safely parse JSON arrays to ensure Prisma accepts them.
    const project = await prisma.project.create({
      data: {
        title: data.title || 'Untitled',
        slug,
        location: data.location || '',
        status: data.status || 'Pre-Selling',
        startingPrice: data.startingPrice || '',
        heroImage: data.heroImage || '',
        featured: data.featured || false,
        description: data.description || '',
        totalArea: data.totalArea || '',
        totalUnits: data.totalUnits || 0,
        availableUnits: data.availableUnits || 0,
        masterplanImage: data.masterplanImage || '',
        overallProgress: data.overallProgress || 0,
        targetCompletion: data.targetCompletion || '',
        archived: data.archived || false,
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || '',
        
        gallery: data.gallery || [],
        constructionGallery: data.constructionGallery || [],
        houseTypes: (data.houseTypes as any) || [],
        facilities: (data.facilities as any) || [],
        constructionPhases: (data.constructionPhases as any) || [],
        constructionUpdates: (data.constructionUpdates as any) || [],
        milestones: (data.milestones as any) || [],
      }
    });
    return project as unknown as Project;
  },

  /**
   * Update an existing project.
   */
  async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    const updateData: any = { ...data };
    delete updateData.id; // ensure ID is not updated
    
    try {
      const project = await prisma.project.update({
        where: { id },
        data: updateData
      });

      // If the title changed, we must update the denormalized projectTitle in related records
      if (updateData.title) {
        const newTitle = updateData.title;
        await Promise.all([
          prisma.propertyUnit.updateMany({
            where: { projectId: id },
            data: { projectTitle: newTitle }
          }),
          prisma.booking.updateMany({
            where: { projectId: id },
            data: { projectTitle: newTitle }
          }),
          prisma.sale.updateMany({
            where: { booking: { projectId: id } }, // assuming booking relates to project
            data: { projectTitle: newTitle }
          })
        ]);
      }

      return project as unknown as Project;
    } catch (err) {
      console.error("Error updating project:", err);
      return null;
    }
  },

  /**
   * Delete (hard delete) a project.
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      await prisma.project.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Helper methods for Homepage and UI
   */
  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: { featured: true, archived: false }
    });
    return projects as unknown as Project[];
  },

  async getFacilities() {
    const project = await prisma.project.findFirst({
      where: { archived: false }
    });
    return (project?.facilities as any) || [];
  },

  async getGalleryImages() {
    const projects = await prisma.project.findMany({
      where: { archived: false },
      select: { gallery: true }
    });
    const allImages = projects.flatMap(p => p.gallery || []);
    return Array.from(new Set(allImages)).slice(0, 8);
  },

  async getStats() {
    const availableProjects = await prisma.project.count({
      where: { archived: false }
    });
    const projects = await prisma.project.findMany({
      where: { archived: false },
      select: { location: true },
      distinct: ['location']
    });
    const cities = new Set(projects.map(p => p.location.split(' ').pop())).size;
    return {
      yearsExperience: '15+',
      completedProjects: 24, // Mock static stat
      availableProjects,
      cities: cities > 0 ? cities : 4,
    };
  },

  async getProjectOptions(): Promise<{label: string, value: string}[]> {
    const projects = await prisma.project.findMany({
      where: { archived: false },
      select: { title: true }
    });
    return [
      { label: 'Select Project', value: '' },
      ...projects.map(p => ({
        label: p.title,
        value: p.title
      }))
    ];
  },

  /**
   * Archive a project (soft delete).
   */
  async archiveProject(id: string): Promise<boolean> {
    try {
      await prisma.project.update({
        where: { id },
        data: { archived: true }
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get a project by its exact ID (useful for Admin Edit).
   */
  async getProjectById(id: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({ 
      where: { id },
      include: { phases: true }
    });
    if (!project) return null;
    return {
      ...project,
      phases: project.phases.map(ph => ({
        ...ph,
        createdAt: ph.createdAt.toISOString(),
        updatedAt: ph.updatedAt.toISOString(),
      }))
    } as unknown as Project;
  },

  /**
   * Update Construction Progress of a project.
   */
  async updateConstructionProgress(id: string, overallProgress: number, targetCompletion: string): Promise<Project | null> {
    try {
      const project = await prisma.project.update({
        where: { id },
        data: { overallProgress, targetCompletion }
      });
      return project as unknown as Project;
    } catch {
      return null;
    }
  }
};
