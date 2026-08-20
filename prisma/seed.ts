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
