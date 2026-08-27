import prisma from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Exporting data from local database...');

  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();
  const rolePermissions = await prisma.rolePermission.findMany();
  const users = await prisma.user.findMany();
  
  const projects = await prisma.project.findMany();
  const projectPhases = await prisma.projectPhase.findMany();
  const propertyStatuses = await prisma.propertyStatus.findMany();
  
  const customers = await prisma.customer.findMany();
  const marketingAgencies = await prisma.marketingAgency.findMany();
  const propertyUnits = await prisma.propertyUnit.findMany();
  
  const leads = await prisma.lead.findMany();
  const bookings = await prisma.booking.findMany();
  const sales = await prisma.sale.findMany();
  const commissions = await prisma.commission.findMany();
  const unitStatusHistories = await prisma.unitStatusHistory.findMany();

  const data = {
    roles,
    permissions,
    rolePermissions,
    users,
    projects,
    projectPhases,
    propertyStatuses,
    customers,
    marketingAgencies,
    propertyUnits,
    leads,
    bookings,
    sales,
    commissions,
    unitStatusHistories
  };

  const outputPath = path.join(__dirname, '../prisma/production-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`Data exported successfully to ${outputPath}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
