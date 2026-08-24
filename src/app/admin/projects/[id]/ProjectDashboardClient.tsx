'use client';

import React, { useState, useTransition } from 'react';
import { Project, PropertyUnit, PropertyStatus } from '@/types/project';
import { SvgSitePlanRenderer } from '@/components/admin/SvgSitePlanRenderer/SvgSitePlanRenderer';
import { Modal } from '@/components/ui/Modal/Modal';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { createPhaseAction, deletePhaseAction, updatePhaseAction } from '@/actions/adminPhaseActions';
import { createPropertyAjaxAction } from '@/actions/adminPropertyActions';
import { createStatusAction, updateStatusAction, deleteStatusAction } from '@/actions/adminStatusActions';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import styles from './ProjectDashboardClient.module.css';

interface Props {
  project: Project;
  properties: PropertyUnit[];
  statuses: PropertyStatus[];
  canManageProjects?: boolean;
}

export const ProjectDashboardClient: React.FC<Props> = ({ project, properties, statuses, canManageProjects = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'units' | 'settings'>('overview');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(project.phases?.[0]?.id || null);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any | null>(null);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [prefilledUnitId, setPrefilledUnitId] = useState<string>('');
  const [isEditSvgIdModalOpen, setIsEditSvgIdModalOpen] = useState(false);
  const [editingSvgId, setEditingSvgId] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [uploadedSvg, setUploadedSvg] = useState<string>('');

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<PropertyStatus | null>(null);

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedSvg(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const openAddModal = () => {
    setEditingPhase(null);
    setUploadedSvg('');
    setIsPhaseModalOpen(true);
  };

  const openEditModal = (phase: any) => {
    setEditingPhase(phase);
    setUploadedSvg('');
    setIsPhaseModalOpen(true);
  };

  const handleSavePhase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      projectId: project.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      sitePlanSvg: uploadedSvg, // Use the uploaded state
      status: 'Planning' as const,
      order: parseInt(formData.get('order') as string) || 0,
    };
    
    // If we're editing but didn't upload a new SVG, we keep the old one
    if (editingPhase && !uploadedSvg) {
      delete (data as any).sitePlanSvg;
    }

    startTransition(async () => {
      let res;
      if (editingPhase) {
        res = await updatePhaseAction(editingPhase.id, data, project.id, project.slug);
      } else {
        res = await createPhaseAction(data, project.slug);
      }

      if (res.success) {
        setIsPhaseModalOpen(false);
        setUploadedSvg('');
      } else {
        alert(res.message);
      }
    });
  };

  const handleDeletePhase = async (phaseId: string) => {
    if (!confirm('Are you sure you want to delete this phase? This action cannot be undone.')) return;
    
    startTransition(async () => {
      const res = await deletePhaseAction(phaseId, project.id, project.slug);
      if (res.success) {
        if (selectedPhaseId === phaseId) {
          setSelectedPhaseId(project.phases?.filter(p => p.id !== phaseId)[0]?.id || null);
        }
      } else {
        alert(res.message);
      }
    });
  };

  const openAddUnitModal = (unitId: string = '') => {
    setPrefilledUnitId(unitId);
    setIsAddUnitModalOpen(true);
  };

  const handleSaveUnit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      projectId: project.id,
      unitNumber: formData.get('unitNumber') as string,
      typeName: formData.get('typeName') as string,
      statusId: formData.get('statusId') as string,
      price: parseFloat(formData.get('price') as string),
      landSize: parseFloat(formData.get('landSize') as string) || 0,
      buildingSize: parseFloat(formData.get('buildingSize') as string) || 0,
      bedrooms: parseInt(formData.get('bedrooms') as string) || 0,
      bathrooms: parseInt(formData.get('bathrooms') as string) || 0,
      carports: parseInt(formData.get('carports') as string) || 0,
      phaseId: selectedPhaseId // Default to currently selected phase
    };

    startTransition(async () => {
      const res = await createPropertyAjaxAction(data);
      if (res.success) {
        setIsAddUnitModalOpen(false);
        // We switch to the phases tab so they can see the newly colored SVG block
        setActiveTab('phases');
      } else {
        alert(res.message);
      }
    });
  };

  const handleSaveSvgId = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newId = formData.get('newId') as string;
    
    if (!newId || newId.trim() === '') return;
    
    const phase = project.phases?.find(p => p.id === selectedPhaseId);
    if (!phase || !phase.sitePlanSvg) return;
    
    const escapedOldId = editingSvgId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let newSvgString = phase.sitePlanSvg;
    
    const idRegex = new RegExp(`id=["']${escapedOldId}["']`, 'g');
    newSvgString = newSvgString.replace(idRegex, `id="${newId}"`);
    
    const dataIdRegex = new RegExp(`data-id=["']${escapedOldId}["']`, 'g');
    newSvgString = newSvgString.replace(dataIdRegex, `data-id="${newId}"`);
    
    startTransition(async () => {
      const res = await updatePhaseAction(phase.id, { sitePlanSvg: newSvgString }, project.id, project.slug);
      if (res.success) {
        setIsEditSvgIdModalOpen(false);
      } else {
        alert(res.message);
      }
    });
  };

  const handleSaveStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      projectId: project.id,
      name: formData.get('name') as string,
      colorHex: formData.get('colorHex') as string,
      order: parseInt(formData.get('order') as string) || 0,
    };

    startTransition(async () => {
      try {
        if (editingStatus) {
          await updateStatusAction(editingStatus.id, project.id, data);
        } else {
          await createStatusAction(data);
        }
        setIsStatusModalOpen(false);
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  const handleDeleteStatus = async (statusId: string) => {
    if (!confirm('Are you sure you want to delete this status? Units using this status might lose their visual representation.')) return;
    
    startTransition(async () => {
      try {
        await deleteStatusAction(statusId, project.id);
      } catch (error: any) {
        alert(error.message);
      }
    });
  };

  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExportPDF = async (phaseId: string, phaseName: string) => {
    setIsExporting(phaseId);
    try {
      const containerId = `siteplan-export-container-${phaseId}`;
      const element = document.getElementById(containerId);
      
      if (!element) {
        throw new Error("Could not find the Site Plan container to export.");
      }

      // Capture the element using html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate aspect ratio for PDF (Landscape A4)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const targetWidth = imgWidth * ratio;
      const targetHeight = imgHeight * ratio;
      const marginX = (pdfWidth - targetWidth) / 2;
      const marginY = (pdfHeight - targetHeight) / 2;

      pdf.addImage(imgData, 'PNG', marginX, marginY, targetWidth, targetHeight);
      pdf.save(`SitePlan-${project.slug}-${phaseName.replace(/\s+/g, '-')}.pdf`);

    } catch (error: any) {
      alert("Error exporting PDF: " + error.message);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'phases' ? styles.active : ''}`}
          onClick={() => setActiveTab('phases')}
        >
          Phases & Site Plan
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'units' ? styles.active : ''}`}
          onClick={() => setActiveTab('units')}
        >
          Property Units
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <div className={styles.card}>
              <h3>Details</h3>
              <p><strong>Starting Price:</strong> {project.startingPrice}</p>
              <p><strong>Total Units:</strong> {project.totalUnits}</p>
              <p><strong>Available Units:</strong> {project.availableUnits}</p>
              <p><strong>Area:</strong> {project.totalArea}</p>
              <p><strong>Description:</strong> {project.description}</p>
            </div>
            <div className={styles.card}>
              <h3>SEO Info</h3>
              <p><strong>Meta Title:</strong> {project.metaTitle}</p>
              <p><strong>Meta Description:</strong> {project.metaDescription}</p>
            </div>
          </div>
        )}

        {activeTab === 'phases' && (
          <div className={styles.phasesTab}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Construction Phases</h3>
                {canManageProjects && (
                  <button className={styles.primaryBtn} onClick={openAddModal}>+ Add Phase</button>
                )}
              </div>
              
              {(!project.phases || project.phases.length === 0) ? (
                <p className={styles.emptyState}>No phases created yet. Click "Add Phase" to create one and upload your SVG Site Plan.</p>
              ) : (
                <div className={styles.phaseSelector}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    {project.phases.map(phase => (
                      <button 
                        key={phase.id}
                        onClick={() => setSelectedPhaseId(phase.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: '1px solid',
                          borderColor: selectedPhaseId === phase.id ? '#1D4ED8' : '#E5E7EB',
                          backgroundColor: selectedPhaseId === phase.id ? '#EFF6FF' : 'white',
                          color: selectedPhaseId === phase.id ? '#1D4ED8' : '#4B5563',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {phase.name}
                      </button>
                    ))}
                  </div>

                  {project.phases.filter(p => p.id === selectedPhaseId).map(phase => (
                    <div key={phase.id} className={styles.phaseCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0 }}>{phase.name} <span className={styles.badge}>{phase.status}</span></h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleExportPDF(phase.id, phase.name)} 
                            disabled={isExporting === phase.id}
                            style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid #10B981', color: '#047857', backgroundColor: '#ECFDF5', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {isExporting === phase.id ? 'Exporting...' : 'Export PDF'}
                          </button>
                          {canManageProjects && (
                            <>
                              <button onClick={() => openEditModal(phase)} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Edit Phase</button>
                              <button onClick={() => handleDeletePhase(phase.id)} disabled={isPending} style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid #FCA5A5', color: '#DC2626', backgroundColor: '#FEF2F2', borderRadius: '4px', cursor: 'pointer' }}>Delete Phase</button>
                            </>
                          )}
                        </div>
                      </div>
                      <p>{phase.description}</p>
                      
                      <div className={styles.svgContainer}>
                        {phase.sitePlanSvg ? (
                          <SvgSitePlanRenderer 
                            svgContent={phase.sitePlanSvg}
                            properties={properties}
                            statuses={statuses}
                            phaseId={phase.id}
                            onRegisterUnit={openAddUnitModal}
                            onEditSvgId={(id) => {
                              setEditingSvgId(id);
                              setIsEditSvgIdModalOpen(true);
                            }}
                          />
                        ) : (
                          <div className={styles.noSvg}>No SVG Uploaded</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className={styles.unitsTab}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Property Units</h3>
                {canManageProjects && (
                  <button className={styles.primaryBtn} onClick={() => openAddUnitModal('')}>+ Add Unit</button>
                )}
              </div>
              <p>Manage all units in this project. Units can be linked to a Phase so they appear on the Site Plan SVG.</p>
              
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Unit Number</th>
                    <th>Type</th>
                    <th>Phase</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length === 0 ? (
                    <tr><td colSpan={5} style={{textAlign: 'center', padding: '24px'}}>No units found.</td></tr>
                  ) : (
                    properties.map(unit => (
                      <tr key={unit.id}>
                        <td><strong>{unit.unitNumber}</strong></td>
                        <td>{unit.typeName}</td>
                        <td>{unit.phase?.name || '-'}</td>
                        <td>
                          <span className={styles.statusBadge} style={{ backgroundColor: unit.propertyStatus?.colorHex || '#E5E7EB', color: '#fff' }}>
                            {unit.propertyStatus?.name || 'Unknown'}
                          </span>
                        </td>
                        <td>Rp {unit.price.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsTab}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Unit Statuses</h3>
                {canManageProjects && (
                  <button className={styles.primaryBtn} onClick={() => {
                    setEditingStatus(null);
                    setIsStatusModalOpen(true);
                  }}>+ Add Status</button>
                )}
              </div>
              <p>Manage the statuses and colors for units in this project. Colors will automatically apply to the Site Plan.</p>
              
              <table className={styles.table} style={{ marginTop: '16px' }}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Status Name</th>
                    <th>Color</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.map(status => (
                    <tr key={status.id}>
                      <td>{status.order}</td>
                      <td><strong>{status.name}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '24px', height: '24px', backgroundColor: status.colorHex, borderRadius: '4px', border: '1px solid #E5E7EB' }}></div>
                          <span>{status.colorHex}</span>
                        </div>
                      </td>
                      <td>
                        {canManageProjects && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => { setEditingStatus(status); setIsStatusModalOpen(true); }} style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                            <button onClick={() => handleDeleteStatus(status.id)} style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #FCA5A5', color: '#DC2626', backgroundColor: '#FEF2F2', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.card} style={{ marginTop: '24px' }}>
              <h3>Project Settings</h3>
              <p>Project settings are currently managed through the central edit page.</p>
              <a href={`/admin/projects/${project.id}/edit`} className={styles.primaryBtn} style={{ display: 'inline-block', marginTop: '16px', textDecoration: 'none' }}>
                Go to Edit Project Form
              </a>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isPhaseModalOpen} onClose={() => setIsPhaseModalOpen(false)} title={editingPhase ? "Edit Construction Phase" : "Add Construction Phase"}>
        <form onSubmit={handleSavePhase} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px', padding: '4px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <Input label="Phase Name *" type="text" id="name" name="name" defaultValue={editingPhase?.name} required placeholder="e.g. Cluster A / Tahap 1" />
            <Input label="Order (Sort Priority)" type="number" id="order" name="order" defaultValue={editingPhase?.order ?? 0} required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="description" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-tertiary)' }}>Description (Optional)</label>
            <textarea id="description" name="description" defaultValue={editingPhase?.description} rows={3} className={styles.textarea}></textarea>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="svgFile" style={{ fontWeight: 500, fontSize: '14px' }}>Site Plan SVG File (Optional)</label>
            <div style={{ border: '1px dashed #D1D5DB', padding: '16px', borderRadius: '6px', backgroundColor: '#F9FAFB', textAlign: 'center' }}>
              <input 
                type="file" 
                id="svgFile" 
                accept=".svg" 
                onChange={handleSvgUpload}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              {uploadedSvg && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#059669', fontWeight: 500 }}>
                  ✓ New SVG file loaded successfully ({Math.round(uploadedSvg.length / 1024)} KB)
                </div>
              )}
              {editingPhase && !uploadedSvg && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
                  Current SVG will be kept if you do not upload a new one.
                </div>
              )}
            </div>
            <small className={styles.helpText}>Upload an SVG file. Ensure elements (paths/polygons) have id attributes matching your unit numbers (e.g. id="A-01").</small>
          </div>
          
          <div className={styles.formActions}>
            <button type="button" onClick={() => setIsPhaseModalOpen(false)} className={styles.secondaryBtn}>Cancel</button>
            <button type="submit" disabled={isPending} className={styles.primaryBtn}>
              {isPending ? 'Saving...' : (editingPhase ? 'Save Changes' : 'Create Phase')}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAddUnitModalOpen} onClose={() => setIsAddUnitModalOpen(false)} title="Register New Unit">
        <form onSubmit={handleSaveUnit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px', maxHeight: '70vh', overflowY: 'auto', overflowX: 'hidden', padding: '4px' }}>
          
          <div style={{ padding: '12px', backgroundColor: '#EFF6FF', color: '#1E40AF', borderRadius: '6px', fontSize: '13px' }}>
            <strong>Phase Association:</strong> This unit will automatically be linked to the currently active phase.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Input label="Unit Number / ID *" type="text" id="unitNumber" name="unitNumber" defaultValue={prefilledUnitId} required placeholder="e.g. A-01" />
              <small className={styles.helpText}>Must exactly match the SVG data-id for Site Plan linking.</small>
            </div>
            
            <Input label="Type Name *" type="text" id="typeName" name="typeName" required placeholder="e.g. Type 45, Type 60" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Price (Rp) *" type="number" id="price" name="price" required min="0" defaultValue="0" />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="statusId" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--color-tertiary)' }}>Status *</label>
              <select id="statusId" name="statusId" className={styles.select} required>
                <option value="">Select Status</option>
                {statuses.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input label="Land Size (m²) *" type="number" id="landSize" name="landSize" required min="0" defaultValue="0" />
            <Input label="Building Size (m²) *" type="number" id="buildingSize" name="buildingSize" required min="0" defaultValue="0" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <Input label="Bedrooms *" type="number" id="bedrooms" name="bedrooms" required min="0" defaultValue="0" />
            <Input label="Bathrooms *" type="number" id="bathrooms" name="bathrooms" required min="0" defaultValue="0" />
            <Input label="Carports *" type="number" id="carports" name="carports" required min="0" defaultValue="0" />
          </div>

          <div className={styles.formActions} style={{ marginTop: '16px', position: 'sticky', bottom: 0, backgroundColor: 'white', padding: '16px 0', borderTop: '1px solid #E5E7EB' }}>
            <button type="button" onClick={() => setIsAddUnitModalOpen(false)} className={styles.secondaryBtn}>Cancel</button>
            <button type="submit" disabled={isPending} className={styles.primaryBtn}>
              {isPending ? 'Saving...' : 'Register Unit'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditSvgIdModalOpen} onClose={() => setIsEditSvgIdModalOpen(false)} title="Edit SVG Unit ID">
        <form onSubmit={handleSaveSvgId} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          
          <div style={{ padding: '12px', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '6px', fontSize: '13px', lineHeight: 1.5 }}>
            <strong>Warning:</strong> You are directly modifying the underlying SVG code in the database. Make sure the new ID exactly matches your database Unit Number.
          </div>

          <Input 
            label="Current SVG ID" 
            value={editingSvgId} 
            disabled 
            style={{ backgroundColor: '#F3F4F6' }} 
          />
          
          <Input 
            label="New SVG ID"
            id="newId" 
            name="newId" 
            required 
            placeholder="Enter new ID..." 
            autoFocus 
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="outline" type="button" onClick={() => setIsEditSvgIdModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isPending}>
              Update ID
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title={editingStatus ? "Edit Status" : "Add New Status"}>
        <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <Input 
            label="Status Name"
            id="name" 
            name="name" 
            defaultValue={editingStatus?.name} 
            required 
            placeholder="e.g. Booking Fee, Handover" 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="colorHex" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Color (Hex)</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="color" id="colorHex" name="colorHex" defaultValue={editingStatus?.colorHex || '#34D399'} required style={{ width: '48px', height: '42px', padding: '0', cursor: 'pointer', border: '1px solid #D1D5DB', borderRadius: '6px' }} />
              <input type="text" defaultValue={editingStatus?.colorHex || '#34D399'} readOnly className={styles.input} style={{ flex: 1, backgroundColor: '#F3F4F6' }} />
            </div>
            <small style={{ fontSize: '0.75rem', color: '#6b7280' }}>Click the color box to pick a color.</small>
          </div>
          
          <Input 
            label="Sort Order"
            type="number" 
            id="order" 
            name="order" 
            defaultValue={editingStatus?.order || 0} 
            required 
          />
          <small style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '-12px' }}>Lower numbers appear first in the legend.</small>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="outline" type="button" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isPending}>
              {editingStatus ? 'Save Changes' : 'Create Status'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
