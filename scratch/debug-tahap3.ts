import prisma from '../src/lib/prisma';

async function main() {
  const phase3 = await prisma.projectPhase.findFirst({
    where: { name: 'Tahap 3' }
  });
  
  if (!phase3) {
    console.log("No Tahap 3 found");
    return;
  }
  
  console.log(`Found phase: ${phase3.name} for project ${phase3.projectId}`);
  
  if (!phase3.sitePlanSvg) {
    console.log("No SVG for Tahap 3");
    return;
  }
  
  const regex = /(?:id|data-id)=["']([^"']+)["']/g;
  let match;
  const unitIds = new Set<string>();
  
  while ((match = regex.exec(phase3.sitePlanSvg)) !== null) {
    const id = match[1];
    if (!['Layer_1', 'svg', 'g', 'path', 'rect', 'polygon', 'circle', 'text', 'tspan'].includes(id) && !id.startsWith('path') && !id.startsWith('rect')) {
      unitIds.add(id);
    }
  }
  
  const sampleIds = Array.from(unitIds).slice(0, 20);
  console.log("Sample IDs from SVG:", sampleIds);
  
  const unitsInProject = await prisma.propertyUnit.findMany({
    where: { projectId: phase3.projectId },
    select: { unitNumber: true, phaseId: true }
  });
  
  console.log(`Project has ${unitsInProject.length} units total.`);
  const sampleUnits = unitsInProject.slice(0, 20).map(u => u.unitNumber);
  console.log("Sample Units from DB:", sampleUnits);
}

main().finally(() => prisma.$disconnect());
