export interface HouseType {
  id: string;
  name: string;
  size: {
    building: number; // in sqm
    land: number; // in sqm
  };
  specs: {
    bedrooms: number;
    bathrooms: number;
    carports: number;
  };
  image: string;
  floorPlanImage?: string;
  startingPrice: string;
}

export interface ConstructionPhase {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
  progress?: number; // percentage 0-100
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  iconImage?: string;
}

export interface ConstructionUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface Milestone {
  id: string;
  date: string;
  title: string;
  completed: boolean;
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  sitePlanSvg: string;
  status: string;
  properties?: PropertyUnit[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  status: 'Pre-Selling' | 'Under Construction' | 'Ready to Move' | 'Sold Out';
  startingPrice: string;
  heroImage: string;
  featured: boolean;
  
  // Detail page specifics
  description: string;
  totalArea: string; // e.g. "5 Hectares"
  totalUnits: number;
  availableUnits: number;
  masterplanImage: string;
  
  houseTypes: HouseType[];
  facilities: Facility[];
  
  // Construction specifics
  overallProgress: number;
  targetCompletion: string;
  constructionPhases: ConstructionPhase[]; // Old JSON phase (can be deprecated later)
  phases?: ProjectPhase[]; // New relational phase
  constructionUpdates: ConstructionUpdate[];
  milestones: Milestone[];
  constructionGallery: string[];
  
  gallery: string[];
  
  // Admin & SEO
  archived?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface PropertyStatus {
  id: string;
  projectId: string;
  name: string;
  colorHex: string;
  order: number;
}

export interface PropertyUnit {
  id: string;
  projectId: string;
  phaseId: string | null;
  phase?: {
    id: string;
    name: string;
  } | null;
  projectTitle: string;
  unitNumber: string;
  typeName: string;
  landSize: number;
  buildingSize: number;
  bedrooms: number;
  bathrooms: number;
  carports: number;
  price: number;
  statusId: string;
  propertyStatus?: PropertyStatus;
  gallery: string[];
  floorPlanImage: string;
  facilities: Facility[];

  // Admin fields
  buyerName?: string | null;
  constructionProgress?: number;
  archived?: boolean;
}
