import prisma from './src/lib/prisma';

async function main() {
  console.log('Seeding roles and permissions...');

  // 1. Create Permissions
  const permissionsData = [
    { action: 'manage_users', description: 'Create, edit, and delete users', module: 'User Management' },
    { action: 'manage_roles', description: 'Create, edit, and delete roles and permissions', module: 'User Management' },
    { action: 'manage_projects', description: 'Create, edit, and delete projects and properties', module: 'Projects' },
    { action: 'view_projects', description: 'View projects and properties', module: 'Projects' },
    { action: 'manage_leads', description: 'Manage leads and CRM', module: 'CRM' },
    { action: 'view_leads', description: 'View leads', module: 'CRM' },
    { action: 'manage_bookings', description: 'Manage bookings and sales', module: 'Sales' },
    { action: 'view_bookings', description: 'View bookings and sales', module: 'Sales' },
  ];

  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { action: p.action },
      update: {},
      create: p,
    });
  }

  // 2. Create Super Admin Role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: {
      name: 'Super Admin',
      description: 'Has access to all features in the system',
    },
  });

  // Assign all permissions to Super Admin
  const allPermissions = await prisma.permission.findMany();
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: p.id,
      },
    });
  }

  // 3. Create Sales Agent Role
  const salesRole = await prisma.role.upsert({
    where: { name: 'Sales Agent' },
    update: {},
    create: {
      name: 'Sales Agent',
      description: 'Can manage leads and view projects',
    },
  });

  // Assign specific permissions to Sales Agent
  const salesPermissions = allPermissions.filter(p => 
    ['view_projects', 'manage_leads', 'view_leads'].includes(p.action)
  );

  for (const p of salesPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: salesRole.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: salesRole.id,
        permissionId: p.id,
      },
    });
  }

  // 4. Assign Super Admin to all existing users to prevent lockout
  const users = await prisma.user.findMany();
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { roleId: superAdminRole.id },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
