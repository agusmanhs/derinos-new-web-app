'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project, PropertyUnit, PropertyStatus, ConstructionPhase } from '@/types/project';
import { WhatsAppIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './PublicSitePlanViewer.module.css';

interface Props {
  project: Project;
  properties: PropertyUnit[];
  statuses: PropertyStatus[];
  contactPhone?: string;
}

export const PublicSitePlanViewer: React.FC<Props> = ({
  project,
  properties,
  statuses,
  contactPhone = '6281298431122',
}) => {
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

  // Select phase that has SVG first, or default to first phase
  const phasesWithSvg = useMemo(() => {
    return (project.phases || []).filter((ph) => Boolean(ph.sitePlanSvg && ph.sitePlanSvg.trim().length > 10));
  }, [project.phases]);

  const [activePhaseId, setActivePhaseId] = useState<string>(() => {
    if (phasesWithSvg.length > 0) return phasesWithSvg[0].id;
    return project.phases?.[0]?.id || '';
  });

  const activePhase = useMemo(() => {
    return (project.phases || []).find((ph) => ph.id === activePhaseId) || project.phases?.[0];
  }, [project.phases, activePhaseId]);

  // Viewport Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Selected Unit State
  const [selectedUnit, setSelectedUnit] = useState<PropertyUnit | null>(null);

  // Tooltip State
  const [tooltip, setTooltip] = useState<{ text: string; subtext: string; x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Determine status type for a unit
  const getUnitStatusType = (unit: PropertyUnit): 'available' | 'booked' | 'sold' => {
    const statusName = unit.propertyStatus?.name?.toLowerCase() || '';
    if (statusName.includes('terjual') || statusName.includes('sold') || statusName.includes('akad')) {
      return 'sold';
    }
    if (statusName.includes('book') || statusName.includes('nup') || statusName.includes('proses')) {
      return 'booked';
    }
    return 'available';
  };

  // Stock summary counts for the current project/phase
  const stockSummary = useMemo(() => {
    let availableCount = 0;
    let bookedCount = 0;
    let soldCount = 0;

    properties.forEach((p) => {
      const type = getUnitStatusType(p);
      if (type === 'available') availableCount++;
      else if (type === 'booked') bookedCount++;
      else if (type === 'sold') soldCount++;
    });

    return {
      available: availableCount,
      booked: bookedCount,
      sold: soldCount,
      total: properties.length,
    };
  }, [properties]);

  // Bind SVG elements and event listeners
  useEffect(() => {
    if (!containerRef.current) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Responsive SVG attributes
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
    if (!svgElement.getAttribute('viewBox')) {
      const bbox = svgElement.getBBox?.();
      if (bbox && bbox.width > 0) {
        svgElement.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      }
    }

    const interactiveElements = svgElement.querySelectorAll(
      'path[id], polygon[id], rect[id], path[data-id], polygon[data-id], rect[data-id]'
    );

    interactiveElements.forEach((el) => {
      const id = el.getAttribute('data-id') || el.getAttribute('id');
      if (!id) return;

      const matchedUnit = properties.find(
        (p) => p.unitNumber.toLowerCase().trim() === id.toLowerCase().trim()
      );

      // Clean existing classes & fills
      el.classList.remove('publicInteractiveLot', 'lotAvailable', 'lotBooked', 'lotSold', 'lotFacility', 'lotSelected');

      if (matchedUnit) {
        el.classList.add('publicInteractiveLot');
        const statusType = getUnitStatusType(matchedUnit);
        if (statusType === 'available') el.classList.add('lotAvailable');
        else if (statusType === 'booked') el.classList.add('lotBooked');
        else el.classList.add('lotSold');

        if (selectedUnit && selectedUnit.id === matchedUnit.id) {
          el.classList.add('lotSelected');
        }

        // Attach event handlers
        const handleMouseEnter = (e: MouseEvent) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const statusLabel = statusType === 'available' ? 'Tersedia' : statusType === 'booked' ? 'Dalam Booking' : 'Terjual';
          const priceLabel = matchedUnit.price ? `Rp ${matchedUnit.price.toLocaleString('id-ID')}` : '-';

          setTooltip({
            text: `Kavling ${matchedUnit.unitNumber} (${statusLabel})`,
            subtext: `${matchedUnit.typeName} • ${priceLabel}`,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        };

        const handleMouseMove = (e: MouseEvent) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          setTooltip((prev) => (prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null));
        };

        const handleMouseLeave = () => {
          setTooltip(null);
        };

        const handleClick = (e: MouseEvent) => {
          e.stopPropagation();
          setSelectedUnit(matchedUnit);
        };

        el.addEventListener('mouseenter', handleMouseEnter as any);
        el.addEventListener('mousemove', handleMouseMove as any);
        el.addEventListener('mouseleave', handleMouseLeave as any);
        el.addEventListener('click', handleClick as any);

        // Store cleanup refs if needed
        (el as any)._cleanup = () => {
          el.removeEventListener('mouseenter', handleMouseEnter as any);
          el.removeEventListener('mousemove', handleMouseMove as any);
          el.removeEventListener('mouseleave', handleMouseLeave as any);
          el.removeEventListener('click', handleClick as any);
        };
      } else {
        el.classList.add('lotFacility');
      }
    });

    return () => {
      interactiveElements.forEach((el) => {
        if ((el as any)._cleanup) {
          (el as any)._cleanup();
        }
      });
    };
  }, [activePhase?.sitePlanSvg, properties, selectedUnit]);

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.6));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMoveViewport = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // WhatsApp CTA message generation
  const getWhatsAppUrl = (unit: PropertyUnit) => {
    const statusType = getUnitStatusType(unit);
    const priceFormatted = unit.price ? `Rp ${unit.price.toLocaleString('id-ID')}` : '-';

    let message = '';
    if (statusType === 'available') {
      message = `Halo Marketing Derinos Group, saya sedang melihat Peta Site Plan proyek *${project.title}*.\n\nSaya sangat tertarik dengan kavling:\n` +
        `• *Nomor Unit*: ${unit.unitNumber}\n` +
        `• *Tipe Rumah*: ${unit.typeName}\n` +
        `• *Luas*: LB ${unit.buildingSize}m² / LT ${unit.landSize}m²\n` +
        `• *Estimasi Harga*: ${priceFormatted}\n\n` +
        `Apakah unit ini masih tersedia? Boleh mohon dikirimkan brosur lengkap, denah layout, dan info simulasi cicilan KPR-nya? Terima kasih!`;
    } else {
      const statusText = statusType === 'booked' ? 'sudah dibooking' : 'sudah terjual';
      message = `Halo Marketing Derinos Group, saya melihat *Kavling ${unit.unitNumber}* (${unit.typeName}) di proyek *${project.title}* statusnya ${statusText}.\n\nApakah masih ada unit sejenis atau alternatif kavling lain di blok terdekat yang masih tersedia? Boleh minta infonya? Terima kasih.`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const formatRupiah = (val?: number) => {
    if (!val) return 'Hubungi Marketing';
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const calculateKprEstimate = (price?: number) => {
    if (!price || price <= 0) return null;
    // Asumsi DP 10%, bunga KPR 4.5% fixed 3 tahun, tenor 20 tahun (~Rp 6.100 / 1 jt pinjaman)
    const loanAmount = price * 0.9;
    const monthlyEstimate = Math.round((loanAmount / 1000000) * 6100);
    const inMillions = (monthlyEstimate / 1000000).toFixed(1);
    return `Mulai Rp ${inMillions} Jt-an / bulan`;
  };

  const hasSvg = Boolean(activePhase?.sitePlanSvg && activePhase.sitePlanSvg.trim().length > 10);

  return (
    <section className={styles.section} id="siteplan">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.pulseDot} />
            <span>PETA KAVLING DIGITAL REAL-TIME</span>
          </div>
          <h2 className={styles.title}>Site Plan & Peta Kavling Interaktif</h2>
          <p className={styles.subtitle}>
            Jelajahi denah proyek {project.title}. Pilih dan klik kavling pada peta untuk melihat posisi, spesifikasi unit, ketersediaan stok, dan konsultasikan langsung dengan marketing kami via WhatsApp.
          </p>
        </div>

        {/* Phase Selector Tabs (if multiple phases exist) */}
        {project.phases && project.phases.length > 1 && (
          <div className={styles.phaseTabs}>
            {project.phases.map((ph, idx) => (
              <button
                key={ph.id}
                onClick={() => {
                  setActivePhaseId(ph.id);
                  setSelectedUnit(null);
                  handleResetZoom();
                }}
                className={`${styles.phaseTab} ${activePhaseId === ph.id ? styles.phaseTabActive : ''}`}
              >
                {ph.name || `Tahap ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Main Viewer Card */}
        <div className={styles.viewerCard}>
          {/* Top Bar: Legend & Controls */}
          <div className={styles.topBar}>
            <div className={styles.legendList}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotAvailable}`} />
                <span>Tersedia ({stockSummary.available})</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotBooked}`} />
                <span>Dalam Proses ({stockSummary.booked})</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.dotSold}`} />
                <span>Terjual ({stockSummary.sold})</span>
              </div>
            </div>

            {hasSvg && (
              <div className={styles.controls}>
                <button onClick={handleZoomOut} className={styles.controlBtn} title="Zoom Out" aria-label="Zoom Out">
                  −
                </button>
                <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
                <button onClick={handleZoomIn} className={styles.controlBtn} title="Zoom In" aria-label="Zoom In">
                  +
                </button>
                <button onClick={handleResetZoom} className={styles.controlBtn} title="Reset View" aria-label="Reset View" style={{ fontSize: '0.75rem', width: 'auto', padding: '0 10px' }}>
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Viewport: SVG or Fallback Masterplan */}
          {hasSvg ? (
            <div
              className={styles.viewport}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMoveViewport}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                ref={containerRef}
                className={styles.svgWrapper}
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                }}
                dangerouslySetInnerHTML={{ __html: activePhase!.sitePlanSvg }}
              />

              {/* Tooltip */}
              {tooltip && (
                <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }}>
                  <div>{tooltip.text}</div>
                  <div style={{ opacity: 0.8, fontSize: '0.7rem' }}>{tooltip.subtext}</div>
                </div>
              )}

              {/* Selected Unit Drawer / Card */}
              {selectedUnit && (
                <div className={styles.unitDrawer}>
                  <div className={styles.drawerHeader}>
                    <div>
                      <h3 className={styles.unitNumber}>Kavling {selectedUnit.unitNumber}</h3>
                      <p className={styles.unitTypeName}>{selectedUnit.typeName} • {project.title}</p>
                    </div>
                    <button
                      onClick={() => setSelectedUnit(null)}
                      className={styles.closeDrawerBtn}
                      aria-label="Tutup Detail Unit"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {getUnitStatusType(selectedUnit) === 'available' && (
                      <span className={`${styles.statusPill} ${styles.statusAvailable}`}>
                        🟢 Unit Tersedia (Available)
                      </span>
                    )}
                    {getUnitStatusType(selectedUnit) === 'booked' && (
                      <span className={`${styles.statusPill} ${styles.statusBooked}`}>
                        🟡 Sedang Dalam Proses (Booked)
                      </span>
                    )}
                    {getUnitStatusType(selectedUnit) === 'sold' && (
                      <span className={`${styles.statusPill} ${styles.statusSold}`}>
                        🔴 Telah Terjual (Sold Out)
                      </span>
                    )}
                  </div>

                  {/* Specs Grid */}
                  <div className={styles.specsGrid}>
                    <div className={styles.specItem}>
                      <div className={styles.specLabel}>Bangunan</div>
                      <div className={styles.specValue}>{selectedUnit.buildingSize || 0} m²</div>
                    </div>
                    <div className={styles.specItem}>
                      <div className={styles.specLabel}>Tanah</div>
                      <div className={styles.specValue}>{selectedUnit.landSize || 0} m²</div>
                    </div>
                    <div className={styles.specItem}>
                      <div className={styles.specLabel}>Kamar</div>
                      <div className={styles.specValue}>{selectedUnit.bedrooms || 0} KT / {selectedUnit.bathrooms || 0} KM</div>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className={styles.priceBox}>
                    <div className={styles.priceLabel}>Estimasi Harga Unit</div>
                    <div className={styles.priceValue}>{formatRupiah(selectedUnit.price)}</div>
                    {calculateKprEstimate(selectedUnit.price) && (
                      <div className={styles.kprEstimate}>
                        Cicilan KPR: {calculateKprEstimate(selectedUnit.price)}
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Action Button */}
                  <Link
                    href={getWhatsAppUrl(selectedUnit)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.whatsappBtn} ${
                      getUnitStatusType(selectedUnit) !== 'available' ? styles.whatsappBtnSecondary : ''
                    }`}
                  >
                    <WhatsAppIcon size={18} color="#ffffff" />
                    <span>
                      {getUnitStatusType(selectedUnit) === 'available'
                        ? 'Tanya & Booking via WhatsApp'
                        : 'Tanya Unit Serupa via WhatsApp'}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            /* Fallback to Masterplan Image */
            <div className={styles.masterplanFallback}>
              {project.masterplanImage ? (
                <Image
                  src={project.masterplanImage}
                  alt={`Masterplan ${project.title}`}
                  fill
                  className={styles.imageCover}
                  priority
                />
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  Denah Masterplan Proyek
                </div>
              )}
              <div className={styles.fallbackOverlay}>
                <div className={styles.fallbackText}>
                  <h4>Masterplan Proyek {project.title}</h4>
                  <p>Hubungi marketing konsultan kami untuk pengecekan denah kavling, nomor blok, dan ketersediaan unit terbaru.</p>
                </div>
                <Link
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Halo Marketing Derinos Group, saya ingin informasi peta kavling dan unit tersedia di proyek ${project.title}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                  style={{ width: 'auto' }}
                >
                  <WhatsAppIcon size={18} color="#ffffff" />
                  <span>Cek Kavling via WhatsApp</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

