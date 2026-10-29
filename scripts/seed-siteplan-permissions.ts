import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function main() {
  console.log('--- Seeding Siteplan Permissions ---');

  const newPermissions = [
    {
      action: 'update_construction_progress',
      description: 'Update unit construction progress on siteplan',
      module: 'Projects',
    },
    {
      action: 'update_unit_status',
      description: 'Update unit status (Booking, Berkas, Akad) on siteplan',
      module: 'Projects',
    },
  ];

  for (const perm of newPermissions) {
    const existing = await prisma.permission.findUnique({
      where: { action: perm.action },
    });

    if (!existing) {
      const created = await prisma.permission.create({
        data: perm,
      });
      console.log(`Created permission: ${created.action} (${created.id})`);
    } else {
      console.log(`Permission already exists: ${existing.action}`);
    }
  }

  // Find all permissions now
  const allPermissions = await prisma.permission.findMany();

  // Find Super Admin role
  const superAdminRole = await prisma.role.findFirst({
    where: { name: 'Super Admin' },
    include: { permissions: true },
  });

  if (superAdminRole) {
    for (const perm of allPermissions) {
      const hasPerm = superAdminRole.permissions.some(
        (rp) => rp.permissionId === perm.id
      );
      if (!hasPerm) {
        await prisma.rolePermission.create({
          data: {
            roleId: superAdminRole.id,
            permissionId: perm.id,
          },
        });
        console.log(`Assigned ${perm.action} to Super Admin`);
      }
    }
  }

  // Find Field Agent role
  const fieldAgentRole = await prisma.role.findFirst({
    where: {
      OR: [
        { name: 'Field Agent' },
        { name: { contains: 'Field', mode: 'insensitive' } },
        { name: { contains: 'Lapangan', mode: 'insensitive' } },
      ],
    },
    include: { permissions: true },
  });

  if (fieldAgentRole) {
    const progressPerm = allPermissions.find(
      (p) => p.action === 'update_construction_progress'
    );
    if (progressPerm) {
      const hasPerm = fieldAgentRole.permissions.some(
        (rp) => rp.permissionId === progressPerm.id
      );
      if (!hasPerm) {
        await prisma.rolePermission.create({
          data: {
            roleId: fieldAgentRole.id,
            permissionId: progressPerm.id,
          },
        });
        console.log(`Assigned update_construction_progress to ${fieldAgentRole.name}`);
      } else {
        console.log(`${fieldAgentRole.name} already has update_construction_progress`);
      }
    }

    // Ensure Field Agent does NOT have manage_projects or update_unit_status
    const disallowedActions = ['manage_projects', 'update_unit_status'];
    for (const action of disallowedActions) {
      const permObj = allPermissions.find((p) => p.action === action);
      if (permObj) {
        const hasPerm = fieldAgentRole.permissions.find(
          (rp) => rp.permissionId === permObj.id
        );
        if (hasPerm) {
          await prisma.rolePermission.delete({
            where: {
              roleId_permissionId: {
                roleId: fieldAgentRole.id,
                permissionId: permObj.id,
              },
            },
          });
          console.log(`Removed ${action} from ${fieldAgentRole.name}`);
        }
      }
    }
  }

  console.log('--- Seeding Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
