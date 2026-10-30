'use client';

import React, { useState } from 'react';
import { PhotoLightboxModal } from './PhotoLightboxModal';

interface ConstructionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  onOpenUpdateModal?: (unit: any) => void;
  canUpdateProgress?: boolean;
}

export const ConstructionHistoryModal: React.FC<ConstructionHistoryModalProps> = ({
  isOpen,
  onClose,
  unit,
  onOpenUpdateModal,
  canUpdateProgress = false,
}) => {
  const [lightboxState, setLightboxState] = useState<{ photos: string[]; index: number } | null>(null);

  if (!isOpen || !unit) return null;

  const updates = unit.constructionUpdates || [];
  const currentProgress = unit.constructionProgress || 0;

  const getProgressColor = (prog: number) => {
    if (prog === 0) return '#94a3b8';
    if (prog < 50) return '#f59e0b';
    if (prog < 100) return '#3b82f6';
    return '#10b981';
  };

  const getProgressBadgeLabel = (prog: number) => {
    if (prog === 0) return 'Belum Mulai';
    if (prog < 40) return 'Tahap Pondasi';
    if (prog < 75) return 'Struktur & Dinding';
    if (prog < 100) return 'Finishing & Atap';
    return 'Selesai 100%';
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '16px',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '18px 24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  KAVLING
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  Unit {unit.unitNumber.toUpperCase()}
                </h3>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                {unit.projectTitle || unit.project?.title} {unit.phase ? `• ${unit.phase.name}` : ''} • Tipe {unit.typeName}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#0f172a')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            {/* Unit Summary Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Status Saat Ini
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getProgressColor(currentProgress) }}>
                      {currentProgress}%
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: `${getProgressColor(currentProgress)}18`,
                        color: getProgressColor(currentProgress),
                        border: `1px solid ${getProgressColor(currentProgress)}35`,
                      }}
                    >
                      {getProgressBadgeLabel(currentProgress)}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Konsumen:</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                    {unit.customer?.name || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Stok Bebas (Belum Ada)</span>}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${currentProgress}%`,
                    height: '100%',
                    backgroundColor: getProgressColor(currentProgress),
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Timeline Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                Linimasa Riwayat Pembangunan ({updates.length} Catatan)
              </h4>
              {canUpdateProgress && onOpenUpdateModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenUpdateModal(unit);
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  + Update Progres Baru
                </button>
              )}
            </div>

            {/* Timeline List */}
            {updates.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  border: '2px dashed #e2e8f0',
                  borderRadius: '10px',
                  color: '#64748b',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏗️</div>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#334155' }}>
                  Belum ada riwayat update
                </h5>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Unit ini belum memiliki riwayat catatan atau foto dokumentasi pembangunan.
                </p>
                {canUpdateProgress && onOpenUpdateModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUpdateModal(unit);
                    }}
                    style={{
                      marginTop: '16px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Input Update Pertama Sekarang
                  </button>
                )}
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical Timeline Guide Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '12px',
                    bottom: '12px',
                    width: '2px',
                    backgroundColor: '#e2e8f0',
                  }}
                />

                {updates.map((update: any, index: number) => {
                  const updateDate = new Date(update.createdAt);
                  const formattedDate = updateDate.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div key={update.id || index} style={{ position: 'relative', marginBottom: '24px' }}>
                      {/* Timeline Dot */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-20px',
                          top: '4px',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: getProgressColor(update.progress),
                          boxShadow: '0 0 0 3px #ffffff, 0 0 0 4px #cbd5e1',
                        }}
                      />

                      {/* Card Content */}
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: getProgressColor(update.progress),
                                backgroundColor: `${getProgressColor(update.progress)}15`,
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              {update.progress}% Selesai
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{formattedDate}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        {update.notes ? (
                          <p style={{ margin: '0 0 10px 0', fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
                            {update.notes}
                          </p>
                        ) : (
                          <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            Tidak ada catatan tertulis.
                          </p>
                        )}

                        {/* Photos Grid */}
                        {update.photos && update.photos.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                              Dokumentasi ({update.photos.length} Foto):
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {update.photos.map((photo: string, pIdx: number) => (
                                <div
                                  key={pIdx}
                                  onClick={() => setLightboxState({ photos: update.photos, index: pIdx })}
                                  style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: '1px solid #cbd5e1',
                                    transition: 'transform 0.15s ease',
                                  }}
                                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                  <img
                                    src={photo}
                                    alt="Foto Progres"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '14px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: '#f8fafc',
            }}
          >
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {lightboxState && (
        <PhotoLightboxModal
          isOpen={true}
          onClose={() => setLightboxState(null)}
          photos={lightboxState.photos}
          initialIndex={lightboxState.index}
          title={`Dokumentasi Unit ${unit.unitNumber.toUpperCase()}`}
        />
      )}
    </>
  );
};
