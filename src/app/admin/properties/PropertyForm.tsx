'use client';

import React, { useActionState, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PropertyUnit, Project } from '@/types/project';
import { savePropertyAction } from '@/actions/adminPropertyActions';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import styles from './PropertyForm.module.css';

interface Props {
  property?: PropertyUnit;
  projects: Project[]; // For the dropdown
  customers: any[]; // For the customer dropdown
  propertyStatuses: any[]; // For the status dropdown
}

const initialState = {
  success: true,
  message: '',
};

export const PropertyForm: React.FC<Props> = ({ property, projects, customers, propertyStatuses }) => {
  const [state, formAction, isPending] = useActionState(savePropertyAction, initialState);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    property?.projectId || (projects[0]?.id || '')
  );
  const [selectedHouseTypeId, setSelectedHouseTypeId] = useState<string>('');

  const [formData, setFormData] = useState({
    unitNumber: property?.unitNumber || '',
    typeName: property?.typeName || '',
    statusId: property?.statusId || (propertyStatuses[0]?.id || ''),
    customerId: property?.customerId || '',
    price: property?.price?.toString() || '',
    landSize: property?.landSize?.toString() || '',
    buildingSize: property?.buildingSize?.toString() || '',
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    carports: property?.carports?.toString() || '',
  });

  // Get active project and its master house types
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const houseTypes = useMemo(() => {
    return ((currentProject?.houseTypes as any[]) || []);
  }, [currentProject]);

  // Auto-detect existing house type match in edit mode
  useEffect(() => {
    if (property?.typeName && houseTypes.length > 0 && !selectedHouseTypeId) {
      const match = houseTypes.find(
        (h: any) => h.name?.toLowerCase().trim() === property.typeName.toLowerCase().trim()
      );
      if (match) {
        setSelectedHouseTypeId(match.id);
      }
    }
  }, [property?.typeName, houseTypes, selectedHouseTypeId]);

  const handleProjectChange = (newProjectId: string) => {
    setSelectedProjectId(newProjectId);
    setSelectedHouseTypeId('');
  };

  const handleHouseTypeSelect = (houseTypeId: string) => {
    setSelectedHouseTypeId(houseTypeId);
    if (!houseTypeId) return;

    const ht = houseTypes.find((h: any) => h.id === houseTypeId);
    if (ht) {
      const bSize = ht.buildingSize ?? ht.size?.building ?? '';
      const lSize = ht.landSize ?? ht.size?.land ?? '';
      const bd = ht.bedrooms ?? ht.specs?.bedrooms ?? '';
      const bt = ht.bathrooms ?? ht.specs?.bathrooms ?? '';
      const cp = ht.carports ?? ht.specs?.carports ?? '';
      let pr = ht.price ?? '';
      if (!pr && typeof ht.startingPrice === 'number') pr = ht.startingPrice;
      if (!pr && typeof ht.startingPrice === 'string') {
        const cleaned = ht.startingPrice.replace(/[^0-9]/g, '');
        if (cleaned) pr = cleaned;
      }

      setFormData((prev) => ({
        ...prev,
        typeName: ht.name || prev.typeName,
        landSize: lSize !== '' ? lSize.toString() : prev.landSize,
        buildingSize: bSize !== '' ? bSize.toString() : prev.buildingSize,
        bedrooms: bd !== '' ? bd.toString() : prev.bedrooms,
        bathrooms: bt !== '' ? bt.toString() : prev.bathrooms,
        carports: cp !== '' ? cp.toString() : prev.carports,
        price: pr !== '' ? pr.toString() : prev.price,
      }));
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className={styles.form} action={formAction}>
      {!state.success && (
        <div className={styles.errorAlert}>{state.message}</div>
      )}
      
      {property?.id && <input type="hidden" name="id" value={property.id} />}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Unit Information</h3>
        <div className={styles.grid}>
          <Input 
            name="unitNumber" 
            label="Unit Number *" 
            value={formData.unitNumber} 
            onChange={(e) => handleFieldChange('unitNumber', e.target.value)}
            required 
            placeholder="e.g. B-12"
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>Project *</label>
            <select 
              name="projectId" 
              className={styles.select} 
              value={selectedProjectId} 
              onChange={(e) => handleProjectChange(e.target.value)}
              required
            >
              <option value="" disabled>Select a project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* Quick House Type Selector for Auto-Fill */}
          {houseTypes.length > 0 && (
            <div className={styles.houseTypeAutoFillBox}>
              <div className={styles.autoFillHeader}>
                <span className={styles.autoFillBadge}>⚡ Auto-Fill</span>
                <label htmlFor="houseTypeAutoFill" className={styles.autoFillLabel}>
                  Pilih Master Tipe Rumah ({currentProject?.title}):
                </label>
              </div>
              <select
                id="houseTypeAutoFill"
                value={selectedHouseTypeId}
                onChange={(e) => handleHouseTypeSelect(e.target.value)}
                className={styles.autoFillSelect}
              >
                <option value="">-- Pilih Tipe Rumah (Auto-Fill Otomatis) --</option>
                {houseTypes.map((ht: any) => {
                  const bSize = ht.buildingSize ?? ht.size?.building ?? 0;
                  const lSize = ht.landSize ?? ht.size?.land ?? 0;
                  const rawPrice = ht.price ?? (typeof ht.startingPrice === 'number' ? ht.startingPrice : (typeof ht.startingPrice === 'string' ? Number(ht.startingPrice.replace(/[^0-9]/g, '')) : 0));
                  const priceStr = rawPrice ? ` — Rp ${Number(rawPrice).toLocaleString('id-ID')}` : '';
                  return (
                    <option key={ht.id} value={ht.id}>
                      {ht.name} (LB: {bSize}m² / LT: {lSize}m²){priceStr}
                    </option>
                  );
                })}
              </select>
              <span className={styles.autoFillHint}>
                Memilih tipe rumah akan otomatis mengisi Tipe, Harga acuan, Luas Tanah, Luas Bangunan, Kamar, dan Carport. Anda tetap dapat mengedit nilai bidang di bawah ini jika unit memiliki kelebihan tanah (hook) atau penyesuaian khusus.
              </span>
            </div>
          )}

          <Input 
            name="typeName" 
            label="House Type *" 
            value={formData.typeName} 
            onChange={(e) => handleFieldChange('typeName', e.target.value)}
            required 
            placeholder="e.g. Type 45"
          />

          <div className={styles.formGroup}>
            <label className={styles.label}>Status *</label>
            <select 
              name="statusId" 
              className={styles.select} 
              value={formData.statusId} 
              onChange={(e) => handleFieldChange('statusId', e.target.value)}
              required
            >
              <option value="" disabled>Select status</option>
              {propertyStatuses.map((status: any) => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Customer / Buyer</label>
            <select 
              name="customerId" 
              className={styles.select} 
              value={formData.customerId}
              onChange={(e) => handleFieldChange('customerId', e.target.value)}
            >
              <option value="">-- No Customer Assigned --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Specifications & Pricing</h3>
        <div className={styles.grid}>
          <Input 
            name="price" 
            label="Price (Rp) *" 
            type="number"
            value={formData.price} 
            onChange={(e) => handleFieldChange('price', e.target.value)}
            required 
          />
          <Input 
            name="landSize" 
            label="Land Size (sqm)" 
            type="number"
            value={formData.landSize} 
            onChange={(e) => handleFieldChange('landSize', e.target.value)}
          />
          <Input 
            name="buildingSize" 
            label="Building Size (sqm)" 
            type="number"
            value={formData.buildingSize} 
            onChange={(e) => handleFieldChange('buildingSize', e.target.value)}
          />
          <Input 
            name="bedrooms" 
            label="Bedrooms" 
            type="number"
            value={formData.bedrooms} 
            onChange={(e) => handleFieldChange('bedrooms', e.target.value)}
          />
          <Input 
            name="bathrooms" 
            label="Bathrooms" 
            type="number"
            value={formData.bathrooms} 
            onChange={(e) => handleFieldChange('bathrooms', e.target.value)}
          />
          <Input 
            name="carports" 
            label="Carports" 
            type="number"
            value={formData.carports} 
            onChange={(e) => handleFieldChange('carports', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/admin/properties">
          <Button variant="outlined" type="button">Cancel</Button>
        </Link>
        <Button variant="primary" type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Unit'}
        </Button>
      </div>
    </form>
  );
};
