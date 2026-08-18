import { PropertyUnit } from '@/types/project';
import { facilities } from './mockData';

const commonGallery = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
];

const floorPlan = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'; // Placeholder using architecture

export const mockProperties: PropertyUnit[] = Array.from({ length: 35 }).map((_, i) => {
  const isGreenwood = i % 3 === 0;
  const isValley = i % 3 === 1;
  
  const projectId = isGreenwood ? 'prj-1' : isValley ? 'prj-2' : 'prj-3';
  const projectTitle = isGreenwood ? 'Greenwood Residence' : isValley ? 'The Valley Estate' : 'Oasis Townhomes';
  
  const typeName = isGreenwood ? (i % 2 === 0 ? 'Type 36' : 'Type 45') 
                 : isValley ? 'Type 60' 
                 : '3-Story Premium';

  const bedrooms = isGreenwood ? (i % 2 === 0 ? 2 : 3) : isValley ? 3 : 4;
  const bathrooms = isGreenwood ? (i % 2 === 0 ? 1 : 2) : isValley ? 3 : 4;
  const carports = isGreenwood ? 1 : isValley ? 2 : 2;
  const buildingSize = isGreenwood ? (i % 2 === 0 ? 36 : 45) : isValley ? 60 : 150;
  const landSize = isGreenwood ? (i % 2 === 0 ? 72 : 90) : isValley ? 120 : 90;
  
  // Base price in USD for calculation: Greenwood ~2.4M-3.1M, Valley 1.8M, Oasis 4.5M
  const basePrice = isGreenwood ? (i % 2 === 0 ? 2400000 : 3100000) 
                  : isValley ? 1800000 
                  : 4500000;
  
  // Randomize price slightly based on unit number
  const price = basePrice + (i * 15000);

  // Status distribution
  const statusRand = Math.random();
  const status = statusRand > 0.7 ? 'Sold' : statusRand > 0.5 ? 'Reserved' : 'Available';

  return {
    id: `unit-${100 + i}`,
    projectId,
    projectTitle,
    unitNumber: `${isGreenwood ? 'A' : isValley ? 'B' : 'C'}-${10 + i}`,
    typeName,
    landSize,
    buildingSize,
    bedrooms,
    bathrooms,
    carports,
    price,
    status,
    gallery: commonGallery,
    floorPlanImage: floorPlan,
    facilities, // Shared mock facilities
  };
});
