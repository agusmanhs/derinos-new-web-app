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
  constructionPhases: ConstructionPhase[];
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

export interface PropertyUnit {
  id: string;
  projectId: string;
  projectTitle: string;
  unitNumber: string;
  typeName: string;
  landSize: number;
  buildingSize: number;
  bedrooms: number;
  bathrooms: number;
  carports: number;
  price: number;
  status: 'Available' | 'Reserved' | 'Sold';
  gallery: string[];
  floorPlanImage: string;
  facilities: Facility[];

  // Admin fields
  archived?: boolean;
}
