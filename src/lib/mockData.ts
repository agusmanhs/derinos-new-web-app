import { Project, Facility, ConstructionPhase } from '@/types/project';

const defaultFacilities: Facility[] = [
  { id: 1, name: 'Clubhouse', description: 'Exclusive resident access', iconImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=200&auto=format&fit=crop' },
  { id: 2, name: '24/7 Security', description: 'Gated community with CCTV', iconImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=200&auto=format&fit=crop' },
  { id: 3, name: 'Jogging Track', description: 'Nature-scenic route', iconImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=200&auto=format&fit=crop' },
  { id: 4, name: 'Central Park', description: 'Lush green communal area', iconImage: 'https://images.unsplash.com/photo-1588693822295-ff040523091e?q=80&w=200&auto=format&fit=crop' },
];

const defaultPhases: ConstructionPhase[] = [
  { id: 1, name: 'Land Clearing', status: 'completed' },
  { id: 2, name: 'Foundation', status: 'completed' },
  { id: 3, name: 'Structure', status: 'active', progress: 75 },
  { id: 4, name: 'Finishing', status: 'pending' },
  { id: 5, name: 'Handover', status: 'pending' },
];

const defaultGallery = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2067&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?q=80&w=2070&auto=format&fit=crop',
];

export const mockProjects: Project[] = [
  {
    id: 'prj-1',
    title: 'Greenwood Residence',
    slug: 'greenwood-residence',
    location: 'West Jakarta',
    status: 'Under Construction',
    startingPrice: '$2.4M',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    featured: true,
    description: 'Greenwood Residence offers an unparalleled living experience, combining modern architectural prestige with lush natural surroundings. Designed for those who seek tranquility without compromising urban connectivity.',
    totalArea: '5 Hectares',
    totalUnits: 120,
    availableUnits: 34,
    masterplanImage: 'https://images.unsplash.com/photo-1541888086925-0c1448b11a5e?q=80&w=2000&auto=format&fit=crop', // Architecture drawing placeholder
    houseTypes: [
      {
        id: 'type-36',
        name: 'Type 36 / The Minimalist',
        size: { building: 36, land: 72 },
        specs: { bedrooms: 2, bathrooms: 1, carports: 1 },
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
        startingPrice: '$2.4M',
      },
      {
        id: 'type-45',
        name: 'Type 45 / The Executive',
        size: { building: 45, land: 90 },
        specs: { bedrooms: 3, bathrooms: 2, carports: 1 },
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1000&auto=format&fit=crop',
        startingPrice: '$3.1M',
      }
    ],
    facilities: defaultFacilities,
    constructionPhases: defaultPhases,
    gallery: defaultGallery,
  },
  {
    id: 'prj-2',
    title: 'The Valley Estate',
    slug: 'the-valley-estate',
    location: 'South Jakarta',
    status: 'Ready to Move',
    startingPrice: '$1.8M',
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    featured: false,
    description: 'The Valley Estate is a premium residential enclave offering breathtaking views and uncompromised luxury. Every detail is crafted to provide a sanctuary from the bustling city life.',
    totalArea: '3.2 Hectares',
    totalUnits: 80,
    availableUnits: 5,
    masterplanImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop', 
    houseTypes: [
      {
        id: 'type-60',
        name: 'Type 60 / The Grand',
        size: { building: 60, land: 120 },
        specs: { bedrooms: 3, bathrooms: 3, carports: 2 },
        image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000&auto=format&fit=crop',
        startingPrice: '$1.8M',
      }
    ],
    facilities: defaultFacilities,
    constructionPhases: [
      { id: 1, name: 'Land Clearing', status: 'completed' },
      { id: 2, name: 'Foundation', status: 'completed' },
      { id: 3, name: 'Structure', status: 'completed' },
      { id: 4, name: 'Finishing', status: 'completed' },
      { id: 5, name: 'Handover', status: 'completed' },
    ],
    gallery: defaultGallery,
  },
  {
    id: 'prj-3',
    title: 'Oasis Townhomes',
    slug: 'oasis-townhomes',
    location: 'Central Jakarta',
    status: 'Pre-Selling',
    startingPrice: '$4.5M',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    description: 'An exclusive collection of modern townhomes situated right in the heart of the city. Oasis Townhomes defines urban luxury with smart home integrations and private rooftop gardens.',
    totalArea: '1.5 Hectares',
    totalUnits: 45,
    availableUnits: 45,
    masterplanImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop',
    houseTypes: [
      {
        id: 'townhome-1',
        name: '3-Story Premium',
        size: { building: 150, land: 90 },
        specs: { bedrooms: 4, bathrooms: 4, carports: 2 },
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
        startingPrice: '$4.5M',
      }
    ],
    facilities: [
      { id: 1, name: 'Private Rooftop', description: 'City skyline views', iconImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=200&auto=format&fit=crop' },
      { id: 2, name: 'Smart Home', description: 'Integrated automation', iconImage: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=200&auto=format&fit=crop' },
    ],
    constructionPhases: [
      { id: 1, name: 'Land Clearing', status: 'active', progress: 30 },
      { id: 2, name: 'Foundation', status: 'pending' },
    ],
    gallery: defaultGallery,
  }
];

export const companyStats = {
  yearsExperience: '15+',
  completedProjects: 24,
  availableProjects: 12,
  cities: 4,
};

export const featuredProjects = mockProjects.filter(p => p.featured);
export const facilities = defaultFacilities;
export const galleryImages = defaultGallery;
export const constructionPhases = defaultPhases;
