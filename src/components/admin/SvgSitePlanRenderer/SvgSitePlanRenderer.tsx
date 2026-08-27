'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyUnit, PropertyStatus } from '@/types/project';
import styles from './SvgSitePlanRenderer.module.css';
import { UpdateUnitStatusModal } from './UpdateUnitStatusModal';

interface Props {
  svgContent: string;
  properties: PropertyUnit[];
  statuses: PropertyStatus[];
  customers: any[];
  agencies: any[];
  phaseId: string;
  onRegisterUnit?: (unitId: string) => void;
  onEditSvgId?: (oldId: string) => void;
}

type SelectedUnitState = { type: 'mapped'; unit: PropertyUnit } | { type: 'unmapped'; id: string };

export const SvgSitePlanRenderer: React.FC<Props> = ({ 
  svgContent, 
  properties, 
  statuses,
  customers,
  agencies,
  phaseId,
  onRegisterUnit,
  onEditSvgId
}) => {
  const router = useRouter();
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<SelectedUnitState | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    if (!svgContainerRef.current) return;

    // Get all paths and polygons within the SVG
    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    // We look for elements with IDs or data-ids that might match unit numbers
    const interactableElements = svgElement.querySelectorAll('path[id], polygon[id], rect[id], path[data-id], polygon[data-id], rect[data-id]');

    interactableElements.forEach((el) => {
      const id = el.getAttribute('data-id') || el.getAttribute('id');
      if (!id) return;
      
      // Add a class so the user knows this SVG element has an ID
      el.classList.add('hasId');

      // Try to find a matching property unit across all project properties
      const matchedUnit = properties.find(
        p => p.unitNumber.toLowerCase().trim() === id.toLowerCase().trim()
      );

      // Clean up previous inline fills to allow CSS classes to work
      el.removeAttribute('fill');
      statuses.forEach(s => el.classList.remove(`status-${s.id}`));

      if (matchedUnit) {
        // Apply status class
        el.classList.add('interactiveElement');
        el.classList.add(`status-${matchedUnit.statusId}`);
        
        // Add attribute for event delegation
        el.setAttribute('data-unit-id', matchedUnit.id);
        el.removeAttribute('data-unmapped-id');
        
        // Add a title tooltip
        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = `Unit: ${matchedUnit.unitNumber} | Type: ${matchedUnit.typeName} | Status: ${matchedUnit.propertyStatus?.name || 'Unknown'}`;
        
        // Remove old title if exists
        const oldTitle = el.querySelector('title');
        if (oldTitle) el.removeChild(oldTitle);
        
        el.appendChild(titleEl);
      } else {
        // Elements with IDs that don't match any unit in the database
        el.classList.add('unmappedElement');
        el.setAttribute('data-unmapped-id', id);
        el.removeAttribute('data-unit-id');
        
        // Add a tooltip so the admin knows what ID this is!
        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = `Unmapped SVG ID: ${id} (Create this unit in the database)`;
        
        const oldTitle = el.querySelector('title');
        if (oldTitle) el.removeChild(oldTitle);
        el.appendChild(titleEl);
      }
    });

  }, [svgContent, properties, phaseId]);

  const handleSvgClick = (e: React.MouseEvent) => {
    const target = e.target as Element;
    
    // Check for mapped units
    const mappedInteractable = target.closest('[data-unit-id]');
    if (mappedInteractable) {
      const unitId = mappedInteractable.getAttribute('data-unit-id');
      const unit = properties.find(p => p.id === unitId);
      if (unit) {
        setSelectedUnit({ type: 'mapped', unit });
        return;
      }
    } 

    // Check for unmapped units
    const unmappedInteractable = target.closest('[data-unmapped-id]');
    if (unmappedInteractable) {
      const id = unmappedInteractable.getAttribute('data-unmapped-id');
      if (id) {
        setSelectedUnit({ type: 'unmapped', id });
        return;
      }
    }

    // Clicked elsewhere
    setSelectedUnit(null);
  };

  return (
    <div className={styles.wrapper}>
      <div id={`siteplan-export-container-${phaseId}`} className={styles.mainContent} style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px' }}>
        <style>
          {statuses.map(s => `.status-${s.id} { fill: ${s.colorHex} !important; }`).join('\n')}
        </style>
        <div className={styles.legend}>
          {statuses.map(s => (
            <div key={s.id} className={styles.legendItem}>
              <span className={styles.swatch} style={{ backgroundColor: s.colorHex }}></span> {s.name}
            </div>
          ))}
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchUnmapped}`}></span> Unmapped / Other
          </div>
        </div>
        
        <div 
          ref={svgContainerRef}
          id={`svg-container-${phaseId}`}
          className={styles.svgContainer}
          dangerouslySetInnerHTML={{ __html: svgContent }} 
          onClick={handleSvgClick}
        />
      </div>

      <div className={styles.sidePanel}>
        {!selectedUnit ? (
          <div style={{ textAlign: 'center', color: '#6B7280', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <p style={{ margin: 0, fontSize: '15px' }}>Click a unit block on the site plan to view its details or register a new unit.</p>
          </div>
        ) : (
          <>
            <div className={styles.sidePanelHeader}>
              <h3>Unit {selectedUnit.type === 'mapped' ? selectedUnit.unit.unitNumber : selectedUnit.id}</h3>
              <button className={styles.closeBtn} onClick={() => setSelectedUnit(null)}>×</button>
            </div>
            
            {selectedUnit.type === 'unmapped' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '6px', fontSize: '14px', lineHeight: 1.5 }}>
                  <strong>Unmapped Unit</strong><br/>
                  This unit is present in the SVG Site Plan but has not been created in the database yet.
                </div>
                
                <button 
                  onClick={() => onRegisterUnit && onRegisterUnit(selectedUnit.id)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#1D4ED8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                >
                  + Register Unit {selectedUnit.id}
                </button>
                <button 
                  onClick={() => onEditSvgId && onEditSvgId(selectedUnit.id)}
                  style={{ width: '100%', padding: '10px', backgroundColor: 'white', color: '#4B5563', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}
                >
                  Edit SVG ID
                </button>
              </div>
            ) : (
              <>
                <div className={styles.panelSection}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Status</span>
                    <span className={styles.swatch} style={{ display: 'inline-block', width: 'auto', padding: '2px 8px', height: 'auto', fontSize: '12px', fontWeight: 600, backgroundColor: selectedUnit.unit.propertyStatus?.colorHex || '#E5E7EB', color: '#fff' }}>
                      {selectedUnit.unit.propertyStatus?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Price</span>
                    <span className={styles.dataValue}>Rp {selectedUnit.unit.price.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className={styles.panelSection}>
                  <h4>Specifications</h4>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Type</span>
                    <span className={styles.dataValue}>{selectedUnit.unit.typeName}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Land Area</span>
                    <span className={styles.dataValue}>{selectedUnit.unit.landSize} m²</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Building Area</span>
                    <span className={styles.dataValue}>{selectedUnit.unit.buildingSize} m²</span>
                  </div>
                </div>
                
                <div className={styles.panelSection}>
                  <h4>Customer Info</h4>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Buyer</span>
                    <span className={styles.dataValue}>{selectedUnit.unit.customer?.name || '-'}</span>
                  </div>
                </div>
                
                <div className={styles.panelSection}>
                  <h4>Construction Progress</h4>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Completion</span>
                    <span className={styles.dataValue}>{selectedUnit.unit.constructionProgress || 0}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${selectedUnit.unit.constructionProgress || 0}%` }}></div>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => window.location.href = `/admin/properties/${selectedUnit.unit.id}/edit`}
                      style={{ flex: 1, padding: '10px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Edit Details
                    </button>
                    <button 
                      onClick={() => setIsStatusModalOpen(true)}
                      style={{ flex: 1, padding: '10px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Update Status
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button 
                      onClick={() => onEditSvgId && onEditSvgId(selectedUnit.unit.unitNumber)}
                      style={{ flex: 1, padding: '10px', backgroundColor: 'white', color: '#4B5563', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }}
                    >
                      Edit SVG ID
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {selectedUnit?.type === 'mapped' && (
        <UpdateUnitStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          unit={selectedUnit.unit}
          currentStatusId={selectedUnit.unit.statusId}
          statuses={statuses}
          customers={customers}
          agencies={agencies}
          onSuccess={() => {
            // Wait for revalidation to complete or manually trigger refresh
            setTimeout(() => {
              router.refresh();
              // Update the local state immediately for better UX
              setSelectedUnit(null);
            }, 100);
          }}
        />
      )}
    </div>
  );
};
