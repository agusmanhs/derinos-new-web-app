import prisma from '../src/lib/prisma';

async function main() {
  const project = await prisma.project.findFirst({
    where: { title: { contains: 'Nami Land', mode: 'insensitive' } }
  });
  if (!project) return console.log("Project not found");
  
  const tahap4 = await prisma.projectPhase.findFirst({
    where: { projectId: project.id, name: 'Tahap 4' }
  });
  if (!tahap4) return console.log("Tahap 4 not found");
  
  const res = await prisma.propertyUnit.updateMany({
    where: {
      projectId: project.id,
      unitNumber: { in: ['c-g1', 'c-a1', 'C-G1', 'C-A1'] }
    },
    data: { phaseId: tahap4.id }
  });
  console.log(`Updated ${res.count} units to Tahap 4`);
}
main().finally(() => prisma.$disconnect());
