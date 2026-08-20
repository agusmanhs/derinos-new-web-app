import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');
  
  // 1. Seed Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@derinos.com' },
    update: {},
    create: {
      email: 'admin@derinos.com',
      name: 'Super Admin',
      password: 'password123', // In a real app, hash this!
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Created user with id: ${superAdmin.id}`);

  // 2. Seed Initial Project
  const project = await prisma.project.upsert({
    where: { slug: 'greenwood-residence' },
    update: {},
    create: {
      title: 'Greenwood Residence',
      slug: 'greenwood-residence',
      location: 'South Jakarta, Indonesia',
      status: 'Pre-Selling',
      startingPrice: '$250,000',
      heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      featured: true,
      description: 'A premium residential complex featuring modern architecture...',
      totalArea: '5 Hectares',
      totalUnits: 150,
      availableUnits: 142,
      masterplanImage: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b',
      facilities: [
        { id: 1, name: 'Clubhouse', description: 'Exclusive clubhouse for residents' },
        { id: 2, name: 'Swimming Pool', description: 'Olympic size pool' }
      ],
      houseTypes: [
        {
          id: 'type-36',
          name: 'Type 36/72 (Azure)',
          size: { building: 36, land: 72 },
          specs: { bedrooms: 2, bathrooms: 1, carports: 1 },
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
          startingPrice: '$250,000'
        }
      ],
      targetCompletion: 'Q4 2026',
    }
  });
  console.log(`Created project with id: ${project.id}`);

  // 3. Seed Project Phase
  const sampleSvg = `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f0fdf4"/>
  <path id="A-01" d="M100 100 h100 v100 h-100 Z" fill="currentColor" stroke="#166534" stroke-width="2"/>
  <path id="A-02" d="M220 100 h100 v100 h-100 Z" fill="currentColor" stroke="#166534" stroke-width="2"/>
  <path id="A-03" d="M340 100 h100 v100 h-100 Z" fill="currentColor" stroke="#166534" stroke-width="2"/>
  <text x="135" y="155" font-family="sans-serif" fill="#166534">A-01</text>
  <text x="255" y="155" font-family="sans-serif" fill="#166534">A-02</text>
  <text x="375" y="155" font-family="sans-serif" fill="#166534">A-03</text>
</svg>`;

  const phase = await prisma.projectPhase.upsert({
    where: {
      projectId_name: {
        projectId: project.id,
        name: 'Tahap 1'
      }
    },
    update: {},
    create: {
      projectId: project.id,
      name: 'Tahap 1',
      description: 'Pembangunan cluster utara',
      sitePlanSvg: sampleSvg,
      status: 'Active'
    }
  });
  console.log(`Created phase with id: ${phase.id}`);

  // 4. Seed Property Units linked to Phase
  const units = [
    { unitNumber: 'A-01', status: 'Available' },
    { unitNumber: 'A-02', status: 'Reserved' },
    { unitNumber: 'A-03', status: 'Sold' },
  ];

  for (const u of units) {
    await prisma.propertyUnit.upsert({
      where: {
        projectId_unitNumber: {
          projectId: project.id,
          unitNumber: u.unitNumber
        }
      },
      update: { phaseId: phase.id },
      create: {
        projectId: project.id,
        phaseId: phase.id,
        projectTitle: project.title,
        unitNumber: u.unitNumber,
        typeName: 'Type 36/72 (Azure)',
        landSize: 72,
        buildingSize: 36,
        bedrooms: 2,
        bathrooms: 1,
        carports: 1,
        price: 250000,
        status: u.status,
        floorPlanImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
      }
    });
  }
  console.log('Seeded property units.');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
