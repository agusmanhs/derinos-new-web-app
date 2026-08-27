'use client';

import React, { useState } from 'react';
import styles from './page.module.css';

export const PropertyDetailClient = ({ property }: { property: any }) => {
  const [viewImageState, setViewImageState] = useState<{ photos: string[], index: number } | null>(null);

  const activeBooking = property.bookings?.find((b: any) => 
    b.status === 'ACTIVE' || b.status === 'COMPLETED'
  ) || property.bookings?.[0]; 

  return (
    <div className={styles.gridContainer}>
      {/* Current Status & Ownership */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Current Status & Ownership</h3>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statusBadgeWrapper}>
            <span className={styles.statusBadge} style={{ backgroundColor: property.propertyStatus?.color || '#ccc' }}>
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
              {property.statusHistory.map((history: any) => (
                <div key={history.id} className={styles.timelineItem}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineDate}>{new Date(history.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className={`${styles.timelineStatus} ${history.statusName === 'Available' ? styles.statusCancelled : styles.statusActive}`}>
                      {history.statusName}
                    </span>
                  </div>
                  <div className={styles.timelineBody}>
                    {history.customer && <p><strong>Customer:</strong> {history.customer.name}</p>}
                    {history.agency && <p><strong>Agency:</strong> {history.agency.name}</p>}
                    {history.notes && <p className={styles.timelineNotes}>"{history.notes}"</p>}
                  </div>
                </div>
              ))}
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
