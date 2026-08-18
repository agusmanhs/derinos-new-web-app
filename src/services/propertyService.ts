import { PropertyUnit } from '@/types/project';
import { mockProperties } from '@/lib/mockPropertyData';

export interface PropertyFilters {
  search?: string;
  project?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const PropertyService = {
  async getProperties(
    filters?: PropertyFilters,
    sort?: string,
    page: number = 1,
    limit: number = 9
  ): Promise<PaginatedResult<PropertyUnit>> {
    await new Promise(resolve => setTimeout(resolve, 400)); // Network simulation

    let results = [...mockProperties];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(p => 
          p.unitNumber.toLowerCase().includes(q) || 
          p.projectTitle.toLowerCase().includes(q)
        );
      }
      if (filters.project && filters.project !== 'All') {
        results = results.filter(p => p.projectTitle === filters.project);
      }
      if (filters.type && filters.type !== 'All') {
        results = results.filter(p => p.typeName === filters.type);
      }
      if (filters.minPrice) {
        results = results.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        results = results.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.bedrooms && filters.bedrooms > 0) {
        results = results.filter(p => p.bedrooms >= filters.bedrooms!);
      }
      if (filters.status && filters.status !== 'All') {
        results = results.filter(p => p.status === filters.status);
      }
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price_asc':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // Mock data doesn't have dates, just reverse ID for proxy
          results.sort((a, b) => b.id.localeCompare(a.id));
          break;
      }
    }

    // Pagination
    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedData = results.slice(start, start + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getPropertyById(id: string): Promise<PropertyUnit | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const property = mockProperties.find(p => p.id === id);
    return property || null;
  },

  async getFilterOptions() {
    const projects = Array.from(new Set(mockProperties.map(p => p.projectTitle)));
    const types = Array.from(new Set(mockProperties.map(p => p.typeName)));
    const statuses = Array.from(new Set(mockProperties.map(p => p.status)));
    return { projects: ['All', ...projects], types: ['All', ...types], statuses: ['All', ...statuses] };
  }
};
