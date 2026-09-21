import prisma from '../src/lib/prisma';
async function main() {
  const projects = await prisma.project.findMany({ select: { title: true, heroImage: true, gallery: true, facilities: true } });
  console.log(JSON.stringify(projects, null, 2));
}
main().finally(() => prisma.$disconnect());
