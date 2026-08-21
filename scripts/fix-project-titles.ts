import prisma from '../src/lib/prisma';

async function main() {
  console.log("Starting project title resync...");
  const projects = await prisma.project.findMany();

  for (const project of projects) {
    console.log(`Syncing ${project.id} -> ${project.title}`);
    
    await prisma.propertyUnit.updateMany({
      where: { projectId: project.id },
      data: { projectTitle: project.title }
    });

    await prisma.booking.updateMany({
      where: { projectId: project.id },
      data: { projectTitle: project.title }
    });

    await prisma.sale.updateMany({
      where: { booking: { projectId: project.id } },
      data: { projectTitle: project.title }
    });
  }
  console.log("Done resyncing project titles!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
