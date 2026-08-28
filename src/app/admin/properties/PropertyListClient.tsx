'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { Button } from '@/components/ui/Button/Button';
import { archivePropertyAction } from '@/actions/adminPropertyActions';
import { PropertyUnit } from '@/types/project';
import { IconEye, IconEdit, IconTrash } from '@/components/ui/Icon/AdminIcons';
import styles from './page.module.css';

interface Props {
  properties: any[]; // Using any to accommodate nested propertyStatus
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  filterOptions: {
    projects: string[];
    types: string[];
    statuses: { id: string; name: string }[];
  };
}

export const PropertyListClient: React.FC<Props> = ({ properties, pagination, filterOptions }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1 on filter
    router.push(`/admin/properties?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/properties?${params.toString()}`);
  };

  const handleArchive = (id: string) => {
    if (confirm('Are you sure you want to delete this unit?')) {
      startTransition(async () => {
        await archivePropertyAction(id);
      });
    }
  };

  return (
    <div className={styles.container}>
      <AdminPageHeader 
        title="Unit Management" 
        description="Manage all property units, availability, and details."
        action={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outlined">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export CSV
            </Button>
            <Link href="/admin/properties/new">
              <Button variant="primary">+ Add New Unit</Button>
            </Link>
          </div>
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
              placeholder="Search by unit ID or customer..." 
              className={styles.searchInput}
              defaultValue={searchParams.get('q') || ''}
              onChange={(e) => {
                const val = e.target.value;
                // Debounce could be added here, for now simple timeout
                setTimeout(() => handleFilterChange('q', val), 500);
              }}
            />
          </div>
          
          <div className={styles.filterSelects}>
            <select 
              className={styles.select} 
              value={searchParams.get('project') || ''}
              onChange={(e) => handleFilterChange('project', e.target.value === 'All' ? '' : e.target.value)}
            >
              <option value="">All Projects</option>
              {filterOptions.projects.filter(p => p !== 'All').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select 
              className={styles.select} 
              value={searchParams.get('status') || ''}
              onChange={(e) => handleFilterChange('status', e.target.value === 'All' ? '' : e.target.value)}
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.filter(s => s.id !== 'All').map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select 
              className={styles.select} 
              value={searchParams.get('type') || ''}
              onChange={(e) => handleFilterChange('type', e.target.value === 'All' ? '' : e.target.value)}
            >
              <option value="">All House Types</option>
              {filterOptions.types.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>UNIT ID</th>
                <th>PROJECT</th>
                <th>TYPE</th>
                <th>SIZE (L/B)</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    No units found matching your filters.
                  </td>
                </tr>
              ) : (
                properties.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.unitNumber.toUpperCase()}</strong></td>
                    <td>{row.projectTitle}</td>
                    <td>{row.typeName}</td>
                    <td>{row.landSize}/{row.buildingSize} sqm</td>
                    <td>Rp {row.price.toLocaleString('id-ID')}</td>
                    <td>
                      <span 
                        className={styles.statusBadge} 
                        style={{ 
                          backgroundColor: row.propertyStatus?.colorHex ? `${row.propertyStatus.colorHex}20` : '#e5e7eb',
                          color: row.propertyStatus?.colorHex || '#374151',
                          border: `1px solid ${row.propertyStatus?.colorHex ? `${row.propertyStatus.colorHex}40` : '#d1d5db'}`
                        }}
                      >
                        {row.propertyStatus?.name?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionIcons}>
                        <Link href={`/admin/properties/${row.id}`} title="View Details">
                          <button className={styles.iconButton}><IconEye /></button>
                        </Link>
                        <Link href={`/admin/properties/${row.id}/edit`} title="Edit Unit">
                          <button className={styles.iconButton}><IconEdit /></button>
                        </Link>
                        {/* <button className={styles.iconButton} onClick={() => handleArchive(row.id)} title="Delete Unit" disabled={isPending}>
                          <IconTrash />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className={styles.pageControls}>
            <button 
              className={styles.pageButton} 
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              &lt;
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              // Simple pagination logic, ideally should handle large number of pages better
              let pageNum = i + 1;
              if (pagination.totalPages > 5 && pagination.page > 3) {
                pageNum = pagination.page - 2 + i;
                if (pageNum > pagination.totalPages) pageNum = pagination.totalPages - (4 - i);
              }
              
              return (
                <button 
                  key={pageNum}
                  className={`${styles.pageButton} ${pagination.page === pageNum ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={styles.pageButton} 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
