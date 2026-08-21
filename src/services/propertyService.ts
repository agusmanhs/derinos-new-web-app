import { PropertyUnit } from '@/types/project';
import prisma from '@/lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export interface PropertyFilters {
  search?: string;
  project?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  statusId?: string;
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
    
    const where: Prisma.PropertyUnitWhereInput = { archived: false };

    if (filters) {
      if (filters.search) {
        const q = filters.search;
        where.OR = [
          { unitNumber: { contains: q, mode: 'insensitive' } },
          { projectTitle: { contains: q, mode: 'insensitive' } }
        ];
      }
      if (filters.project && filters.project !== 'All') {
        where.projectTitle = filters.project;
      }
      if (filters.type && filters.type !== 'All') {
        where.typeName = filters.type;
      }
      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
      }
      if (filters.bedrooms && filters.bedrooms > 0) {
        where.bedrooms = { gte: filters.bedrooms };
      }
      if (filters.statusId && filters.statusId !== 'All') {
        where.statusId = filters.statusId;
      }
    }

    let orderBy: Prisma.PropertyUnitOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBy = { price: 'asc' };
          break;
        case 'price_desc':
          orderBy = { price: 'desc' };
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
      }
    }

    const total = await prisma.propertyUnit.count({ where });
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    const properties = await prisma.propertyUnit.findMany({
      where,
      orderBy,
      skip: start,
      take: limit,
      include: {
        propertyStatus: true
      }
    });

    return {
      data: properties as unknown as PropertyUnit[],
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getPropertyById(id: string): Promise<PropertyUnit | null> {
    const property = await prisma.propertyUnit.findUnique({ where: { id } });
    return property as unknown as PropertyUnit | null;
  },

  async getFilterOptions() {
    const units = await prisma.propertyUnit.findMany({
      where: { archived: false },
      select: { projectTitle: true, typeName: true, propertyStatus: { select: { id: true, name: true } } }
    });
    const projects = Array.from(new Set(units.map(p => p.projectTitle)));
    const types = Array.from(new Set(units.map(p => p.typeName)));
    
    // De-duplicate statuses based on ID
    const statusMap = new Map();
    units.forEach(u => {
      if (u.propertyStatus && !statusMap.has(u.propertyStatus.id)) {
        statusMap.set(u.propertyStatus.id, u.propertyStatus);
      }
    });
    const statuses = Array.from(statusMap.values());
    
    return { 
      projects: ['All', ...projects], 
      types: ['All', ...types], 
      statuses: [{ id: 'All', name: 'All' }, ...statuses] 
    };
  },

  /**
   * Create a new property unit.
   */
  async createProperty(data: Partial<PropertyUnit>): Promise<PropertyUnit> {
    const property = await prisma.propertyUnit.create({
      data: {
        projectId: data.projectId || '',
        phaseId: data.phaseId || null,
        projectTitle: data.projectTitle || '',
        unitNumber: data.unitNumber || '',
        typeName: data.typeName || '',
        landSize: data.landSize || 0,
        buildingSize: data.buildingSize || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        carports: data.carports || 0,
        price: data.price || 0,
        statusId: data.statusId || '',
        floorPlanImage: data.floorPlanImage || '',
        gallery: data.gallery || [],
        facilities: (data.facilities as any) || [],
        archived: data.archived || false,
      }
    });
    return property as unknown as PropertyUnit;
  },

  /**
   * Update an existing property unit.
   */
  async updateProperty(id: string, data: Partial<PropertyUnit>): Promise<PropertyUnit | null> {
    const updateData: any = { ...data };
    delete updateData.id;
    
    try {
      const property = await prisma.propertyUnit.update({
        where: { id },
        data: updateData
      });
      return property as unknown as PropertyUnit;
    } catch {
      return null;
    }
  },

  /**
   * Archive a property (soft delete).
   */
  async archiveProperty(id: string): Promise<boolean> {
    try {
      await prisma.propertyUnit.update({
        where: { id },
        data: { archived: true }
      });
      return true;
    } catch {
      return false;
    }
  }
};
