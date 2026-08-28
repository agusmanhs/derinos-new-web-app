import prisma from '../src/lib/prisma';

async function main() {
  const phases = await prisma.projectPhase.findMany();
  console.log(`Found ${phases.length} phases.`);
  
  let totalUpdated = 0;

  for (const phase of phases) {
    if (!phase.sitePlanSvg) {
      console.log(`Phase ${phase.name} has no SVG.`);
      continue;
    }
    
    // Extract IDs from SVG. Look for id="XXX" or data-id="XXX"
    const regex = /(?:id|data-id)=["']([^"']+)["']/g;
    let match;
    const unitIds = new Set<string>();
    
    while ((match = regex.exec(phase.sitePlanSvg)) !== null) {
      const id = match[1];
      // Ignore common non-unit IDs
      if (!['Layer_1', 'svg', 'g', 'path', 'rect', 'polygon', 'circle', 'text', 'tspan'].includes(id) && !id.startsWith('path') && !id.startsWith('rect')) {
        unitIds.add(id);
      }
    }
    
    console.log(`Phase ${phase.name} has ${unitIds.size} unique IDs in SVG.`);
    
    const unitsInProject = await prisma.propertyUnit.findMany({
      where: { projectId: phase.projectId }
    });
    
    let updatedForPhase = 0;
    
    for (const unit of unitsInProject) {
      // Find case-insensitive match
      const match = Array.from(unitIds).find(uid => uid.toLowerCase() === unit.unitNumber.toLowerCase());
      
      if (match) {
        if (unit.phaseId !== phase.id) {
          await prisma.propertyUnit.update({
            where: { id: unit.id },
            data: { phaseId: phase.id }
          });
          updatedForPhase++;
        }
      } else {
        // Some units might be B1-11 but in SVG it's B11. Or vice versa. Let's try removing dashes.
        const matchNoDash = Array.from(unitIds).find(uid => uid.replace(/-/g, '').toLowerCase() === unit.unitNumber.replace(/-/g, '').toLowerCase());
        if (matchNoDash && unit.phaseId !== phase.id) {
          await prisma.propertyUnit.update({
            where: { id: unit.id },
            data: { phaseId: phase.id }
          });
          updatedForPhase++;
        }
      }
    }
    
    console.log(`Updated ${updatedForPhase} units for Phase ${phase.name}`);
    totalUpdated += updatedForPhase;
  }
  
  console.log(`Total units linked to phases: ${totalUpdated}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
