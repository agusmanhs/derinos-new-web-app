'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { User } from '@/types/auth';
import { updateUserRoleAction, createUserAction } from '@/actions/adminUserActions';
import { Modal } from '@/components/ui/Modal/Modal';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Select } from '@/components/ui/Select/Select';
import styles from './page.module.css';

interface Props {
  users: User[];
  roles: { id: string; name: string; }[];
  currentUserRole?: string;
}

export const UserListClient: React.FC<Props> = ({ users, roles, currentUserRole }) => {
  const [isPending, startTransition] = useTransition();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (id: string, newRole: string) => {
    if (confirm("Apakah Anda yakin ingin mengubah hak akses / role untuk user ini?")) {
      startTransition(async () => {
        try {
          const result = await updateUserRoleAction(id, newRole);
          if (!result.success) throw new Error(result.message);
        } catch (e: any) {
          alert(e.message || 'An error occurred');
        }
      });
    } else {
      // Create a dummy state update to force React to re-render the select with the old value
      setSearchQuery(prev => prev);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword || !newUserRole) {
      alert("Please fill all fields");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await createUserAction({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        roleId: newUserRole
      });
      if (result.success) {
        setIsAddModalOpen(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('');
      } else {
        alert(result.message || 'Failed to create user');
      }
    } catch (e: any) {
      alert(e.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <AdminPageHeader 
        title="Users & Roles" 
        description="Manage system access and assign roles."
        action={
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            + Add User
          </Button>
        }
      />

      <div className={styles.tableCard}>
        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>USER</th>
                <th>ROLE</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Image src={row.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop'} alt={row.name} width={32} height={32} style={{ borderRadius: '50%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong>{row.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{row.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      {(() => {
                        let variant: 'neutral' | 'success' | 'warning' | 'danger' = 'neutral';
                        if (row.role?.name === 'Super Admin') variant = 'danger';
                        if (row.role?.name === 'Management') variant = 'warning';
                        if (row.role?.name === 'Project Manager' || row.role?.name === 'Sales Manager') variant = 'success';
                        return <Badge variant={variant}>{row.role?.name || 'No Role'}</Badge>;
                      })()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Select
                        value={row.roleId || ''}
                        onChange={(e) => handleRoleChange(row.id, e.target.value)}
                        disabled={isPending}
                        options={[
                          { label: 'Select Role', value: '' }, 
                          ...roles
                            .filter(r => currentUserRole === 'Super Admin' || r.name !== 'Super Admin')
                            .map(r => ({ label: r.name, value: r.id }))
                        ]}
                        style={{ width: '150px', display: 'inline-block' }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Name" 
            value={newUserName} 
            onChange={(e) => setNewUserName(e.target.value)} 
            placeholder="e.g. John Doe"
            required
          />
          <Input 
            label="Email" 
            type="email"
            value={newUserEmail} 
            onChange={(e) => setNewUserEmail(e.target.value)} 
            placeholder="e.g. john@derinos.com"
            required
          />
          <Input 
            label="Password" 
            type="password"
            value={newUserPassword} 
            onChange={(e) => setNewUserPassword(e.target.value)} 
            placeholder="Set initial password"
            required
          />
          <Select
            label="Role"
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
            required
            options={[
              { label: 'Select a role', value: '' },
              ...roles
                .filter(r => currentUserRole === 'Super Admin' || r.name !== 'Super Admin')
                .map(r => ({ label: r.name, value: r.id }))
            ]}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
