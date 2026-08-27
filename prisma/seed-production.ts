import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import fs from 'fs';
import path from 'path';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function mapDates(arr: any[]) {
  if (!arr) return [];
  return arr.map(item => {
    const mapped = { ...item };
    if (mapped.createdAt) mapped.createdAt = new Date(mapped.createdAt);
    if (mapped.updatedAt) mapped.updatedAt = new Date(mapped.updatedAt);
    if (mapped.date) mapped.date = new Date(mapped.date);
    if (mapped.birthDate) mapped.birthDate = new Date(mapped.birthDate);
    if (mapped.paymentDate) mapped.paymentDate = new Date(mapped.paymentDate);
    return mapped;
  });
}

async function main() {
  console.log('Starting production data seed...');
  
  const dataPath = path.join(__dirname, 'production-data.json');
  if (!fs.existsSync(dataPath)) {
    console.error('production-data.json not found! Please run export-data.ts locally first.');
    process.exit(1);
  }
  
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  console.log('Clearing existing data on VPS to avoid conflicts...');
  await prisma.unitStatusHistory.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.propertyUnit.deleteMany();
  await prisma.projectPhase.deleteMany();
  await prisma.project.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.marketingAgency.deleteMany();
  await prisma.propertyStatus.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  // 1. Roles & Permissions
  console.log('Seeding Roles...');
  await prisma.role.createMany({ data: mapDates(data.roles), skipDuplicates: true });
  console.log('Seeding Permissions...');
  await prisma.permission.createMany({ data: mapDates(data.permissions), skipDuplicates: true });
  console.log('Seeding RolePermissions...');
  await prisma.rolePermission.createMany({ data: mapDates(data.rolePermissions), skipDuplicates: true });
  
  // 2. Users
  console.log('Seeding Users...');
  await prisma.user.createMany({ data: mapDates(data.users), skipDuplicates: true });

  // 3. Statuses
  console.log('Seeding PropertyStatuses...');
  await prisma.propertyStatus.createMany({ data: mapDates(data.propertyStatuses), skipDuplicates: true });

  // 4. Projects & Phases
  console.log('Seeding Projects...');
  await prisma.project.createMany({ data: mapDates(data.projects), skipDuplicates: true });
  console.log('Seeding ProjectPhases...');
  await prisma.projectPhase.createMany({ data: mapDates(data.projectPhases), skipDuplicates: true });

  // 5. CRM Data (Customers, Agencies, Leads)
  console.log('Seeding Customers...');
  await prisma.customer.createMany({ data: mapDates(data.customers), skipDuplicates: true });
  console.log('Seeding MarketingAgencies...');
  await prisma.marketingAgency.createMany({ data: mapDates(data.marketingAgencies), skipDuplicates: true });
  console.log('Seeding Leads...');
  await prisma.lead.createMany({ data: mapDates(data.leads), skipDuplicates: true });

  // 6. Property Units
  console.log('Seeding PropertyUnits...');
  await prisma.propertyUnit.createMany({ data: mapDates(data.propertyUnits), skipDuplicates: true });

  // 7. Bookings, Sales, Commissions
  console.log('Seeding Bookings...');
  await prisma.booking.createMany({ data: mapDates(data.bookings), skipDuplicates: true });
  console.log('Seeding Sales...');
  await prisma.sale.createMany({ data: mapDates(data.sales), skipDuplicates: true });
  console.log('Seeding Commissions...');
  await prisma.commission.createMany({ data: mapDates(data.commissions), skipDuplicates: true });

  // 8. History
  console.log('Seeding UnitStatusHistories...');
  await prisma.unitStatusHistory.createMany({ data: mapDates(data.unitStatusHistories), skipDuplicates: true });

  console.log('Production data seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
