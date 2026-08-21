'use client';

import React, { useTransition } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Badge } from '@/components/ui/Badge/Badge';
import { togglePermissionAction, createRoleAction, updateRoleAction, deleteRoleAction } from '@/actions/adminRoleActions';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import styles from './RoleListClient.module.css';

interface Props {
  roles: any[];
  allPermissions: any[];
}

export const RoleListClient: React.FC<Props> = ({ roles, allPermissions }) => {
  const [isPending, startTransition] = useTransition();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newRoleName, setNewRoleName] = React.useState('');
  const [newRoleDesc, setNewRoleDesc] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<any>(null);
  const [editRoleName, setEditRoleName] = React.useState('');
  const [editRoleDesc, setEditRoleDesc] = React.useState('');

  const openEditModal = (role: any) => {
    // Prevent editing the core Super Admin role to avoid locking out
    if (role.name === 'Super Admin') {
      alert("Super Admin role cannot be edited or deleted.");
      return;
    }
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditRoleDesc(role.description || '');
    setIsEditModalOpen(true);
  };

  const handleToggle = (roleId: string, permissionId: string, isAssigned: boolean) => {
    startTransition(async () => {
      try {
        const result = await togglePermissionAction(roleId, permissionId, isAssigned);
        if (!result.success) throw new Error(result.message);
      } catch (e: any) {
        alert(e.message);
      }
    });
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await createRoleAction(newRoleName, newRoleDesc);
      if (result.success) {
        setIsAddModalOpen(false);
        setNewRoleName('');
        setNewRoleDesc('');
      } else {
        alert(result.message || 'Failed to create role');
      }
    } catch (e: any) {
      alert(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole || !editRoleName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateRoleAction(editingRole.id, editRoleName, editRoleDesc);
      if (result.success) {
        setIsEditModalOpen(false);
        setEditingRole(null);
      } else {
        alert(result.message || 'Failed to update role');
      }
    } catch (e: any) {
      alert(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!editingRole) return;
    if (!confirm(`Are you sure you want to delete the role "${editingRole.name}"? Users with this role might lose access.`)) return;
    
    setIsSubmitting(true);
    try {
      const result = await deleteRoleAction(editingRole.id);
      if (result.success) {
        setIsEditModalOpen(false);
        setEditingRole(null);
      } else {
        alert(result.message || 'Failed to delete role');
      }
    } catch (e: any) {
      alert(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group permissions by module
  const modules = Array.from(new Set(allPermissions.map(p => p.module)));

  return (
    <div>
      <AdminPageHeader 
        title="Roles & Permissions" 
        description="Manage role permissions using the access matrix."
        action={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            + Add Role
          </Button>
        }
      />

      <div className={styles.matrixContainer}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.stickyCol}>Permission / Role</th>
              {roles.map(role => (
                <th 
                  key={role.id} 
                  style={{ cursor: role.name === 'Super Admin' ? 'default' : 'pointer' }}
                  onClick={() => openEditModal(role)}
                  title={role.name === 'Super Admin' ? 'Core Role' : 'Click to Edit Role'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {role.name}
                    {role.name !== 'Super Admin' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(module => (
              <React.Fragment key={module}>
                <tr className={styles.moduleRow}>
                  <td colSpan={roles.length + 1}>{module}</td>
                </tr>
                {allPermissions.filter(p => p.module === module).map(permission => (
                  <tr key={permission.id}>
                    <td className={styles.stickyCol}>
                      <div className={styles.permName}>{permission.action}</div>
                      <div className={styles.permDesc}>{permission.description}</div>
                    </td>
                    {roles.map(role => {
                      const isAssigned = role.permissions.some((rp: any) => rp.permission.id === permission.id);
                      return (
                        <td key={role.id} className={styles.checkboxCell}>
                          <input 
                            type="checkbox" 
                            checked={isAssigned}
                            onChange={() => handleToggle(role.id, permission.id, isAssigned)}
                            disabled={isPending || role.name === 'Super Admin'} // Prevent removing super admin perms
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Role">
        <form onSubmit={handleAddRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Role Name" 
            value={newRoleName} 
            onChange={(e) => setNewRoleName(e.target.value)} 
            placeholder="e.g. Content Creator"
            required
          />
          <Input 
            label="Description" 
            value={newRoleDesc} 
            onChange={(e) => setNewRoleDesc(e.target.value)} 
            placeholder="Brief description of the role's purpose"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save Role
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Role">
        <form onSubmit={handleUpdateRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Role Name" 
            value={editRoleName} 
            onChange={(e) => setEditRoleName(e.target.value)} 
            required
          />
          <Input 
            label="Description" 
            value={editRoleDesc} 
            onChange={(e) => setEditRoleDesc(e.target.value)} 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <Button variant="danger" type="button" onClick={handleDeleteRole} isLoading={isSubmitting}>
              Delete Role
            </Button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
