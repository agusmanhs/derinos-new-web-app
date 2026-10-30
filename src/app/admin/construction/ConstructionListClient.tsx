'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { Project } from '@/types/project';
import { UpdateProgressModal } from '@/components/admin/SvgSitePlanRenderer/UpdateProgressModal';
import { ConstructionHistoryModal } from './ConstructionHistoryModal';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import styles from './ConstructionList.module.css';

interface Props {
  properties: any[];
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
    phases?: { id: string; name: string; projectId: string }[];
  };
  stats: {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    avgProgress: number;
  };
  projects: Project[];
  canUpdateProgress?: boolean;
}

export const ConstructionListClient: React.FC<Props> = ({
  properties,
  pagination,
  filterOptions,
  stats,
  projects,
  canUpdateProgress = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'units' | 'projects'>('units');

  // Modals state
  const [selectedUnitForUpdate, setSelectedUnitForUpdate] = useState<any | null>(null);
  const [selectedUnitForHistory, setSelectedUnitForHistory] = useState<any | null>(null);
  const [lightboxState, setLightboxState] = useState<{ photos: string[]; index: number; title: string } | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All' && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/admin/construction?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/construction?${params.toString()}`);
  };

  const currentProgressFilter = searchParams.get('progress') || 'all';

  const getProgressColor = (prog: number) => {
    if (prog === 0) return '#94a3b8';
    if (prog < 50) return '#f59e0b';
    if (prog < 100) return '#3b82f6';
    return '#10b981';
  };

  const getProgressStage = (prog: number) => {
    if (prog === 0) return 'Belum Mulai';
    if (prog < 40) return 'Pondasi';
    if (prog < 75) return 'Struktur';
    if (prog < 100) return 'Finishing';
    return 'Selesai 100%';
  };

  return (
    <div className={styles.container}>
      <AdminPageHeader
        title="Monitoring Progres Pembangunan"
        description="Pantau persentase fisik, foto dokumentasi lapangan, dan riwayat pembangunan tiap unit kavling."
        action={
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '3px' }}>
              <button
                onClick={() => setActiveTab('units')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'units' ? '#ffffff' : 'transparent',
                  color: activeTab === 'units' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'units' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                Progres Per Unit
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'projects' ? '#ffffff' : 'transparent',
                  color: activeTab === 'projects' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'projects' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                Ringkasan Proyek Global
              </button>
            </div>
          </div>
        }
      />

      {activeTab === 'units' ? (
        <>
          {/* Top KPI Stat Cards */}
          <div className={styles.statsGrid}>
            <div
              className={styles.statCard}
              onClick={() => handleFilterChange('progress', 'all')}
              title="Klik untuk tampilkan semua unit"
            >
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Total Kavling</span>
                <span className={styles.statValue}>{stats.total}</span>
                <span className={styles.statSubtext}>Unit terdaftar di master data</span>
              </div>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                🏠
              </div>
            </div>

            <div
              className={styles.statCard}
              onClick={() => handleFilterChange('progress', 'not_started')}
              title="Klik untuk filter unit belum mulai (0%)"
              style={{
                borderColor: currentProgressFilter === 'not_started' ? '#f59e0b' : '#e2e8f0',
              }}
            >
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Belum Mulai (0%)</span>
                <span className={styles.statValue} style={{ color: '#64748b' }}>
                  {stats.notStarted}
                </span>
                <span className={styles.statSubtext}>Menunggu pembangunan</span>
              </div>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
                ⏳
              </div>
            </div>

            <div
              className={styles.statCard}
              onClick={() => handleFilterChange('progress', 'in_progress')}
              title="Klik untuk filter unit sedang dibangun (1-99%)"
              style={{
                borderColor: currentProgressFilter === 'in_progress' ? '#3b82f6' : '#e2e8f0',
              }}
            >
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Dalam Pembangunan</span>
                <span className={styles.statValue} style={{ color: '#2563eb' }}>
                  {stats.inProgress}
                </span>
                <span className={styles.statSubtext}>1% sampai 99% selesai</span>
              </div>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                🏗️
              </div>
            </div>

            <div
              className={styles.statCard}
              onClick={() => handleFilterChange('progress', 'completed')}
              title="Klik untuk filter unit selesai (100%)"
              style={{
                borderColor: currentProgressFilter === 'completed' ? '#10b981' : '#e2e8f0',
              }}
            >
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Selesai (100%)</span>
                <span className={styles.statValue} style={{ color: '#059669' }}>
                  {stats.completed}
                </span>
                <span className={styles.statSubtext}>Siap serah terima</span>
              </div>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
                ✅
              </div>
            </div>

            <div className={styles.statCard} style={{ cursor: 'default' }}>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Rata-rata Fisik</span>
                <span className={styles.statValue} style={{ color: '#0f172a' }}>
                  {stats.avgProgress}%
                </span>
                <span className={styles.statSubtext}>Progres kumulatif lapangan</span>
              </div>
              <div className={styles.statIconWrapper} style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
                📊
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className={styles.tableCard}>
            {/* Filter Bar */}
            <div className={styles.filterBar}>
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Cari nomor unit / nama konsumen..."
                  className={styles.searchInput}
                  defaultValue={searchParams.get('q') || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTimeout(() => handleFilterChange('q', val), 400);
                  }}
                />
              </div>

              <div className={styles.filterSelects}>
                {/* Project Filter */}
                <select
                  className={styles.select}
                  value={searchParams.get('project') || ''}
                  onChange={(e) => handleFilterChange('project', e.target.value)}
                >
                  <option value="">Semua Proyek</option>
                  {filterOptions.projects.filter((p) => p !== 'All').map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                {/* Phase Filter */}
                {filterOptions.phases && filterOptions.phases.length > 1 && (
                  <select
                    className={styles.select}
                    value={searchParams.get('phase') || ''}
                    onChange={(e) => handleFilterChange('phase', e.target.value)}
                  >
                    <option value="">Semua Tahap</option>
                    {filterOptions.phases.filter((ph) => ph.id !== 'All').map((ph) => (
                      <option key={ph.id} value={ph.id}>
                        {ph.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Status Filter */}
                <select
                  className={styles.select}
                  value={searchParams.get('status') || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">Semua Status Kavling</option>
                  {filterOptions.statuses.filter((s) => s.id !== 'All').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* Sort Option */}
                <select
                  className={styles.select}
                  value={searchParams.get('sort') || 'progress_desc'}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="progress_desc">Progres Tertinggi</option>
                  <option value="progress_asc">Progres Terendah</option>
                  <option value="unitNumber_asc">Nomor Unit (A-Z)</option>
                  <option value="newest">Terbaru Ditambahkan</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className={styles.chipBar}>
              <span className={styles.chipLabel}>Filter Progres:</span>
              <button
                className={`${styles.chip} ${currentProgressFilter === 'all' ? styles.chipActive : ''}`}
                onClick={() => handleFilterChange('progress', 'all')}
              >
                Semua ({stats.total})
              </button>
              <button
                className={`${styles.chip} ${currentProgressFilter === 'not_started' ? styles.chipActive : ''}`}
                onClick={() => handleFilterChange('progress', 'not_started')}
              >
                ⏳ Belum Mulai / 0% ({stats.notStarted})
              </button>
              <button
                className={`${styles.chip} ${currentProgressFilter === 'in_progress' ? styles.chipActive : ''}`}
                onClick={() => handleFilterChange('progress', 'in_progress')}
              >
                🏗️ Sedang Dibangun ({stats.inProgress})
              </button>
              <button
                className={`${styles.chip} ${currentProgressFilter === 'completed' ? styles.chipActive : ''}`}
                onClick={() => handleFilterChange('progress', 'completed')}
              >
                ✅ Selesai / 100% ({stats.completed})
              </button>
            </div>

            {/* Table */}
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>KODE UNIT</th>
                    <th>PROYEK & TAHAP</th>
                    <th>KONSUMEN</th>
                    <th>STATUS KAVLING</th>
                    <th style={{ width: '220px' }}>PROGRES FISIK</th>
                    <th>DOKUMENTASI</th>
                    <th>UPDATE TERAKHIR</th>
                    <th style={{ textAlign: 'right' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#334155' }}>
                          Tidak ada unit yang sesuai dengan filter
                        </div>
                        <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                          Coba ganti kata kunci pencarian atau reset filter.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    properties.map((unit) => {
                      const prog = unit.constructionProgress || 0;
                      const updates = unit.constructionUpdates || [];
                      const latestUpdate = updates[0] || null;
                      const allPhotos = updates.flatMap((u: any) => u.photos || []);

                      return (
                        <tr key={unit.id}>
                          {/* Unit Code & Type */}
                          <td>
                            <div className={styles.unitCode}>{unit.unitNumber.toUpperCase()}</div>
                            <div className={styles.unitType}>{unit.typeName}</div>
                          </td>

                          {/* Project & Phase */}
                          <td>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                              {unit.projectTitle}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {unit.phase?.name || 'Tahap Default'}
                            </div>
                          </td>

                          {/* Customer */}
                          <td>
                            {unit.customer?.name ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '14px' }}>👤</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{unit.customer.name}</span>
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                Stok Bebas (-)
                              </span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td>
                            <span
                              className={styles.statusBadge}
                              style={{
                                backgroundColor: unit.propertyStatus?.colorHex ? `${unit.propertyStatus.colorHex}18` : '#f1f5f9',
                                color: unit.propertyStatus?.colorHex || '#475569',
                                border: `1px solid ${unit.propertyStatus?.colorHex ? `${unit.propertyStatus.colorHex}35` : '#cbd5e1'}`,
                              }}
                            >
                              {unit.propertyStatus?.name || 'Unknown'}
                            </span>
                          </td>

                          {/* Progress Bar & Stage */}
                          <td>
                            <div className={styles.progressCell}>
                              <div className={styles.progressHeader}>
                                <span className={styles.progressPercent} style={{ color: getProgressColor(prog) }}>
                                  {prog}%
                                </span>
                                <span className={styles.progressStage}>{getProgressStage(prog)}</span>
                              </div>
                              <div className={styles.progressBarBg}>
                                <div
                                  className={styles.progressBarFill}
                                  style={{
                                    width: `${prog}%`,
                                    backgroundColor: getProgressColor(prog),
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Documentation (Photo & Count) */}
                          <td>
                            {allPhotos.length > 0 ? (
                              <div className={styles.photoThumbWrapper}>
                                <img
                                  src={allPhotos[0]}
                                  alt="Dokumentasi"
                                  className={styles.photoThumb}
                                  onClick={() =>
                                    setLightboxState({
                                      photos: allPhotos,
                                      index: 0,
                                      title: `Dokumentasi Unit ${unit.unitNumber.toUpperCase()}`,
                                    })
                                  }
                                  title="Klik untuk perbesar foto"
                                />
                                <span
                                  className={styles.photoCountBadge}
                                  onClick={() =>
                                    setLightboxState({
                                      photos: allPhotos,
                                      index: 0,
                                      title: `Dokumentasi Unit ${unit.unitNumber.toUpperCase()}`,
                                    })
                                  }
                                  title="Lihat semua foto unit ini"
                                >
                                  📸 {allPhotos.length} Foto
                                </span>
                              </div>
                            ) : (
                              <span className={styles.noPhotoText}>Belum ada foto</span>
                            )}
                          </td>

                          {/* Last Update Date & Note */}
                          <td>
                            {latestUpdate ? (
                              <div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                                  {new Date(latestUpdate.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </div>
                                {latestUpdate.notes && (
                                  <div
                                    style={{
                                      fontSize: '0.75rem',
                                      color: '#64748b',
                                      maxWidth: '180px',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                    title={latestUpdate.notes}
                                  >
                                    {latestUpdate.notes}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                Belum ada update
                              </span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td style={{ textAlign: 'right' }}>
                            <div className={styles.actionBtnGroup}>
                              {canUpdateProgress && (
                                <button
                                  className={styles.btnUpdate}
                                  onClick={() => setSelectedUnitForUpdate(unit)}
                                  title="Update persentase dan upload foto progres"
                                >
                                  + Update Progres
                                </button>
                              )}
                              <button
                                className={styles.btnHistory}
                                onClick={() => setSelectedUnitForHistory(unit)}
                                title="Lihat riwayat linimasa update & dokumentasi"
                              >
                                Riwayat ({updates.length})
                              </button>
                              <Link
                                href={`/admin/projects/${unit.projectId}`}
                                className={styles.btnSitePlan}
                                title="Lihat unit di Site Plan SVG"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                                  <line x1="9" y1="3" x2="9" y2="18"></line>
                                  <line x1="15" y1="6" x2="15" y2="21"></line>
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className={styles.pagination}>
              <div className={styles.pageInfo}>
                Menampilkan{' '}
                <strong>
                  {pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}
                </strong>{' '}
                sampai{' '}
                <strong>
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </strong>{' '}
                dari <strong>{pagination.total}</strong> unit
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
        </>
      ) : (
        /* Project-level view */
        <div className={styles.tableCard}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Ringkasan Progres Level Proyek
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Daftar proyek induk beserta target penyelesaian dan progres keseluruhan.
            </p>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>NAMA PROYEK</th>
                  <th>LOKASI</th>
                  <th>TARGET SELESAI</th>
                  <th style={{ width: '240px' }}>PROGRES KESELURUHAN</th>
                  <th style={{ textAlign: 'right' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{proj.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{proj.slug}</div>
                    </td>
                    <td>{proj.location}</td>
                    <td>{proj.targetCompletion || '-'}</td>
                    <td>
                      <div className={styles.progressCell}>
                        <div className={styles.progressHeader}>
                          <span className={styles.progressPercent} style={{ color: getProgressColor(proj.overallProgress) }}>
                            {proj.overallProgress}%
                          </span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div
                            className={styles.progressBarFill}
                            style={{
                              width: `${proj.overallProgress}%`,
                              backgroundColor: getProgressColor(proj.overallProgress),
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtnGroup}>
                        <Link href={`/admin/projects/${proj.id}`} className={styles.btnHistory}>
                          Buka Site Plan
                        </Link>
                        {canUpdateProgress && (
                          <Link href={`/admin/construction/${proj.id}`} className={styles.btnUpdate}>
                            Edit Proyek
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Progress Modal */}
      {selectedUnitForUpdate && (
        <UpdateProgressModal
          isOpen={true}
          unit={selectedUnitForUpdate}
          onClose={() => setSelectedUnitForUpdate(null)}
          onSuccess={() => {
            router.refresh();
            setSelectedUnitForUpdate(null);
          }}
        />
      )}

      {/* History Timeline Modal */}
      {selectedUnitForHistory && (
        <ConstructionHistoryModal
          isOpen={true}
          unit={selectedUnitForHistory}
          canUpdateProgress={canUpdateProgress}
          onClose={() => setSelectedUnitForHistory(null)}
          onOpenUpdateModal={(unit) => setSelectedUnitForUpdate(unit)}
        />
      )}

      {/* Fullscreen Photo Lightbox */}
      {lightboxState && (
        <PhotoLightboxModal
          isOpen={true}
          onClose={() => setLightboxState(null)}
          photos={lightboxState.photos}
          initialIndex={lightboxState.index}
          title={lightboxState.title}
        />
      )}
    </div>
  );
};
