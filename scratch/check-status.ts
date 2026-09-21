import prisma from '../src/lib/prisma';
async function main() {
  const statuses = await prisma.propertyStatus.findMany();
  console.log("Property Statuses:", statuses.map(s => s.name));
}
main().finally(() => prisma.$disconnect());
