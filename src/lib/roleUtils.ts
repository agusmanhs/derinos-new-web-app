/**
 * Pure client/server-safe utility helpers for Role and Permission checks.
 */

export function isFieldAgentRole(roleName: string = '', permissions: string[] = []): boolean {
  const roleNameLower = roleName.toLowerCase();
  const isSuperAdmin = roleName === 'Super Admin';
  return (
    !isSuperAdmin &&
    (roleNameLower.includes('field') ||
      roleNameLower.includes('lapangan') ||
      roleNameLower.includes('konstruksi') ||
      (permissions.includes('update_construction_progress') &&
        !permissions.includes('manage_roles') &&
        !permissions.includes('view_leads')))
  );
}
