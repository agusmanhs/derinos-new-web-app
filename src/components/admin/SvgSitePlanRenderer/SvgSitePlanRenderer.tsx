'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PropertyUnit } from '@/types/project';
import styles from './SvgSitePlanRenderer.module.css';

interface Props {
  svgContent: string;
  properties: PropertyUnit[];
  phaseId: string;
}

export const SvgSitePlanRenderer: React.FC<Props> = ({ svgContent, properties, phaseId }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);

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
      el.classList.remove('available', 'reserved', 'sold');

      if (matchedUnit) {
        // Apply status class
        el.classList.add('interactiveElement');
        el.classList.add(matchedUnit.status.toLowerCase());
        
        // Add attribute for event delegation
        el.setAttribute('data-unit-id', matchedUnit.id);
        
        // Add a title tooltip
        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = `Unit: ${matchedUnit.unitNumber} | Type: ${matchedUnit.typeName} | Status: ${matchedUnit.status}`;
        
        // Remove old title if exists
        const oldTitle = el.querySelector('title');
        if (oldTitle) el.removeChild(oldTitle);
        
        el.appendChild(titleEl);
      } else {
        // Elements with IDs that don't match any unit in the database
        el.classList.add('unmappedElement');
        
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
    const interactable = target.closest('[data-unit-id]');
    if (interactable) {
      const unitId = interactable.getAttribute('data-unit-id');
      const unit = properties.find(p => p.id === unitId);
      if (unit) {
        setSelectedUnit(unit);
      }
    } else {
      setSelectedUnit(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainContent}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchAvailable}`}></span> Available
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchReserved}`}></span> Reserved
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchSold}`}></span> Sold
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchUnmapped}`}></span> Unmapped / Other
          </div>
        </div>
        
        <div 
          ref={svgContainerRef}
          className={styles.svgContainer}
          dangerouslySetInnerHTML={{ __html: svgContent }} 
          onClick={handleSvgClick}
        />
      </div>

      {selectedUnit && (
        <div className={styles.sidePanel}>
          <div className={styles.sidePanelHeader}>
            <h3>Unit {selectedUnit.unitNumber}</h3>
            <button className={styles.closeBtn} onClick={() => setSelectedUnit(null)}>×</button>
          </div>
          
          <div className={styles.panelSection}>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Status</span>
              <span className={`${styles.swatch} ${styles['swatch' + selectedUnit.status.charAt(0).toUpperCase() + selectedUnit.status.slice(1).toLowerCase()]}`} style={{ display: 'inline-block', width: 'auto', padding: '2px 8px', height: 'auto', fontSize: '12px', fontWeight: 600 }}>
                {selectedUnit.status}
              </span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Price</span>
              <span className={styles.dataValue}>Rp {selectedUnit.price.toLocaleString()}</span>
            </div>
          </div>
          
          <div className={styles.panelSection}>
            <h4>Specifications</h4>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Type</span>
              <span className={styles.dataValue}>{selectedUnit.typeName}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Land Area</span>
              <span className={styles.dataValue}>{selectedUnit.landSize} m²</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Building Area</span>
              <span className={styles.dataValue}>{selectedUnit.buildingSize} m²</span>
            </div>
          </div>
          
          <div className={styles.panelSection}>
            <h4>Customer Info</h4>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Buyer</span>
              <span className={styles.dataValue}>{selectedUnit.buyerName || '-'}</span>
            </div>
          </div>
          
          <div className={styles.panelSection}>
            <h4>Construction Progress</h4>
            <div className={styles.dataRow}>
              <span className={styles.dataLabel}>Completion</span>
              <span className={styles.dataValue}>{selectedUnit.constructionProgress || 0}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${selectedUnit.constructionProgress || 0}%` }}></div>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button style={{ width: '100%', padding: '10px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
              Edit Unit Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
