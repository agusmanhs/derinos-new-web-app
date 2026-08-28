import prisma from '../src/lib/prisma';

async function main() {
  const phases = await prisma.projectPhase.findMany();
  let totalUpdated = 0;

  for (const phase of phases) {
    if (!phase.sitePlanSvg) continue;
    
    const regex = /(?:id|data-id)=["']([^"']+)["']/g;
    let match;
    const unitIds = new Set<string>();
    
    while ((match = regex.exec(phase.sitePlanSvg)) !== null) {
      const id = match[1];
      if (!['Layer_1', 'svg', 'g', 'path', 'rect', 'polygon', 'circle', 'text', 'tspan'].includes(id) && !id.startsWith('path') && !id.startsWith('rect')) {
        unitIds.add(id);
      }
    }
    
    const unitsInProject = await prisma.propertyUnit.findMany({
      where: { projectId: phase.projectId }
    });
    
    let updatedForPhase = 0;
    
    for (const unit of unitsInProject) {
      if (unit.phaseId === phase.id) continue;
      
      const unitNum = unit.unitNumber.toLowerCase().replace(/-/g, '');
      const unitParts = unit.unitNumber.toLowerCase().split('-');
      const unitSuffix = unitParts.length > 1 ? unitParts[unitParts.length - 1] : unitNum;
      
      const exactMatch = Array.from(unitIds).find(uid => {
        const cleanUid = uid.toLowerCase().replace(/-/g, '');
        // 1. Exact match
        if (cleanUid === unitNum) return true;
        // 2. SVG has 'l5', DB has 'C-L5'
        if (cleanUid === unitSuffix) return true;
        // 3. SVG has 'c_l5' DB has 'C-L5'
        if (cleanUid.replace(/_/g, '') === unitNum) return true;
        return false;
      });
      
      if (exactMatch) {
        await prisma.propertyUnit.update({
          where: { id: unit.id },
          data: { phaseId: phase.id }
        });
        updatedForPhase++;
      }
    }
    
    console.log(`Updated ${updatedForPhase} units for Phase ${phase.name}`);
    totalUpdated += updatedForPhase;
  }
  
  console.log(`Total aggressively linked units: ${totalUpdated}`);
}

main().finally(() => prisma.$disconnect());
