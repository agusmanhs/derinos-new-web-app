import prisma from './src/lib/prisma';

async function main() {
  console.log('Fetching all statuses...');
  const allStatuses = await prisma.propertyStatus.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const nameMap = new Map<string, string>(); // name (lowercase) -> master status ID

  let deletedCount = 0;
  let updatedUnitsCount = 0;

  for (const status of allStatuses) {
    const key = status.name.trim().toLowerCase();

    if (nameMap.has(key)) {
      // This is a duplicate. Update all units pointing to this, then delete it.
      const masterId = nameMap.get(key)!;
      
      const updateRes = await prisma.propertyUnit.updateMany({
        where: { statusId: status.id },
        data: { statusId: masterId },
      });
      updatedUnitsCount += updateRes.count;

      await prisma.propertyStatus.delete({
        where: { id: status.id },
      });
      deletedCount++;
      console.log(`Merged duplicate status: ${status.name}`);
    } else {
      // This is the first time we see this name, it becomes the master.
      nameMap.set(key, status.id);
      console.log(`Kept master status: ${status.name}`);
    }
  }

  console.log('--- MIGRATION COMPLETE ---');
  console.log(`Total Master Statuses: ${nameMap.size}`);
  console.log(`Total Duplicate Statuses Deleted: ${deletedCount}`);
  console.log(`Total Units Re-assigned: ${updatedUnitsCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
