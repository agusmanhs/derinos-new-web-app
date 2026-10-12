'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

const getTimelineStatusStyle = (statusName: string, customColor?: string) => {
  const norm = (statusName || '').toLowerCase().trim();

  // 1. Cancelled / Dibatalkan -> RED
  if (norm.includes('cancel') || norm.includes('batal')) {
    return {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fca5a5',
      label: 'Cancelled',
      dotColor: '#ef4444'
    };
  }

  // 2. Available -> SLATE / NEUTRAL
  if (norm === 'available') {
    return {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #cbd5e1',
      label: 'Available',
      dotColor: '#94a3b8'
    };
  }

  // 3. Booking -> EMERALD GREEN
  if (norm.includes('booking')) {
    return {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #6ee7b7',
      label: statusName,
      dotColor: '#10b981'
    };
  }

  // 4. Proses Berkas -> BLUE
  if (norm.includes('proses') || norm.includes('berkas')) {
    return {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #93c5fd',
      label: statusName,
      dotColor: '#3b82f6'
    };
  }

  // 5. SP3K -> PURPLE
  if (norm.includes('sp3k')) {
    return {
      backgroundColor: '#f3e8ff',
      color: '#6b21a8',
      border: '1px solid #d8b4fe',
      label: statusName,
      dotColor: '#a855f7'
    };
  }

  // 6. Sudah Akad -> WARM ORANGE / AMBER
  if (norm.includes('akad')) {
    return {
      backgroundColor: '#ffedd5',
      color: '#9a3412',
      border: '1px solid #fdba74',
      label: statusName,
      dotColor: '#f97316'
    };
  }

  // 7. Cash / Lunas -> GOLD / BRONZE
  if (norm.includes('cash') || norm.includes('lunas')) {
    return {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fcd34d',
      label: statusName,
      dotColor: '#eab308'
    };
  }

  // 8. Custom color from PropertyStatus table if available
  if (customColor) {
    return {
      backgroundColor: `${customColor}20`,
      color: customColor,
      border: `1px solid ${customColor}60`,
      label: statusName,
      dotColor: customColor
    };
  }

  return {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: '1px solid #cbd5e1',
    label: statusName,
    dotColor: '#64748b'
  };
};

export const PropertyDetailClient = ({ property }: { property: any }) => {
  const [viewImageState, setViewImageState] = useState<{ photos: string[], index: number } | null>(null);

  const activeBooking = property.bookings?.find((b: any) => 
    b.status === 'ACTIVE' || b.status === 'COMPLETED'
  ) || property.bookings?.[0]; 

  const mainStatusColor = property.propertyStatus?.colorHex || property.propertyStatus?.color || '#64748b';

  return (
    <div className={styles.gridContainer}>
      {/* Current Status & Ownership */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Current Status & Ownership</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statusBadgeWrapper}>
            <span className={styles.statusBadge} style={{ backgroundColor: mainStatusColor }}>
              {property.propertyStatus?.name || 'Unknown Status'}
            </span>
          </div>

          {(property.propertyStatus?.name !== 'Available') ? (
            <div className={styles.ownershipInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Customer</span>
                <span className={styles.infoValue}>{property.customer?.name || activeBooking?.customer?.name || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Agency</span>
                <span className={styles.infoValue}>{activeBooking?.agency?.name || '-'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Booked Date</span>
                <span className={styles.infoValue}>{activeBooking?.date ? new Date(activeBooking.date).toLocaleDateString('id-ID') : '-'}</span>
              </div>
            </div>
          ) : (
            <p className={styles.emptyText}>Unit ini belum dimiliki atau dalam status Available.</p>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Unit Specifications</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Type</span>
              <span className={styles.specValue}>{property.typeName}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Price</span>
              <span className={styles.specValue}>Rp {property.price.toLocaleString('id-ID')}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Land Size</span>
              <span className={styles.specValue}>{property.landSize} m²</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Building Size</span>
              <span className={styles.specValue}>{property.buildingSize} m²</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Bedrooms</span>
              <span className={styles.specValue}>{property.bedrooms}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Bathrooms</span>
              <span className={styles.specValue}>{property.bathrooms}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status History */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Status History</h3>
        </div>
        <div className={styles.cardContent}>
          {property.statusHistory && property.statusHistory.length > 0 ? (
            <div className={styles.timeline}>
              {property.statusHistory.map((history: any) => {
                const badge = getTimelineStatusStyle(history.statusName, history.status?.colorHex);
                const formattedDate = new Date(history.createdAt).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={history.id} className={styles.timelineItem}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineDate}>{formattedDate}</span>
                      <span 
                        className={styles.timelineStatus} 
                        style={{
                          backgroundColor: badge.backgroundColor,
                          color: badge.color,
                          border: badge.border,
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '3px 10px',
                          borderRadius: '12px'
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div className={styles.timelineBody}>
                      {history.customer && <p><strong>Customer:</strong> {history.customer.name}</p>}
                      {history.agency && <p><strong>Agency:</strong> {history.agency.name}</p>}
                      {history.notes && <p className={styles.timelineNotes}>"{history.notes}"</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={styles.emptyText}>Belum ada riwayat status untuk unit ini.</p>
          )}
        </div>
      </div>

      {/* Construction Progress History */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Construction History ({property.constructionProgress || 0}%)</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill} style={{ width: `${property.constructionProgress || 0}%` }} />
          </div>

          {property.constructionUpdates && property.constructionUpdates.length > 0 ? (
            <div className={styles.timeline} style={{ marginTop: '24px' }}>
              {property.constructionUpdates.map((update: any) => (
                <div key={update.id} className={styles.timelineItem}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineDate}>{new Date(update.createdAt).toLocaleDateString('id-ID')}</span>
                    <span className={styles.timelineProgress}>{update.progress}% Complete</span>
                  </div>
                  <div className={styles.timelineBody}>
                    {update.notes && <p className={styles.timelineNotes}>{update.notes}</p>}
                    {update.photos && update.photos.length > 0 && (
                      <div className={styles.gallery}>
                        {update.photos.map((photo: string, i: number) => (
                          <div key={i} onClick={() => setViewImageState({ photos: update.photos, index: i })} className={styles.galleryItem}>
                            <img src={photo} alt="Progress" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText} style={{ marginTop: '16px' }}>Belum ada histori pembangunan yang dicatat.</p>
          )}
        </div>
      </div>

      {/* Lightbox for Photos */}
      {viewImageState && (
        <div 
          className={styles.lightboxOverlay}
          onClick={() => setViewImageState(null)}
        >
          {viewImageState.index > 0 && (
            <button 
              className={styles.lightboxNavLeft}
              onClick={(e) => { e.stopPropagation(); setViewImageState({ ...viewImageState, index: viewImageState.index - 1 }) }}
            >
              &#8592;
            </button>
          )}
          
          <img src={viewImageState.photos[viewImageState.index]} alt="Fullscreen Progress" className={styles.lightboxImage} />
          
          {viewImageState.index < viewImageState.photos.length - 1 && (
            <button 
              className={styles.lightboxNavRight}
              onClick={(e) => { e.stopPropagation(); setViewImageState({ ...viewImageState, index: viewImageState.index + 1 }) }}
            >
              &#8594;
            </button>
          )}

          <button 
            className={styles.lightboxClose}
            onClick={() => setViewImageState(null)} 
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};
