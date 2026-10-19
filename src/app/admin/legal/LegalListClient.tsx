'use client';

import React, { useState, useMemo } from 'react';
import { LegalDocumentItem } from '@/types/legal';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { 
  IconFileLegal, 
  IconWhatsApp, 
  IconFilter
} from '@/components/ui/Icon/AdminIcons';
import styles from './LegalListClient.module.css';

interface Props {
  initialDocuments: LegalDocumentItem[];
}

export const LegalListClient: React.FC<Props> = ({ initialDocuments }) => {
  const [items, setItems] = useState<LegalDocumentItem[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [bankFilter, setBankFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [slikFilter, setSlikFilter] = useState('ALL');

  // Modal states
  const [selectedDoc, setSelectedDoc] = useState<LegalDocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state
  const [newDocForm, setNewDocForm] = useState<Partial<LegalDocumentItem>>({
    customerName: '',
    customerPhone: '',
    customerNik: '',
    customerOccupation: '',
    projectName: 'Cluster Titanium Residence',
    unitNumber: '',
    unitType: 'Tipe 36/72',
    price: 650000000,
    paymentMethod: 'Mortgage',
    bankName: 'Bank BTN',
    plafondAmount: 585000000,
    interestRate: '3.75% Fixed 3 Thn',
    docs: {
      ktpKK: true,
      npwp: true,
      slipGaji: true,
      rekKoran: true,
      skKerja: true,
      slikOjk: 'Kol-1',
    },
    sp3kStatus: 'Draft',
    unitLegality: {
      shmStatus: 'Pecah',
      pbgStatus: 'Lengkap',
      pbbStatus: 'Lunas',
    },
    notaryStatus: 'Menunggu Berkas',
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const totalCount = items.length;
    const totalPlafond = items.reduce((acc, curr) => acc + (curr.plafondAmount || 0), 0);
    const slikKol1Count = items.filter(i => i.docs.slikOjk === 'Kol-1').length;
    const sp3kApprovedCount = items.filter(i => i.sp3kStatus === 'SP3K Terbit').length;
    const readyAkadCount = items.filter(i => i.notaryStatus === 'Siap Akad' || i.notaryStatus === 'Selesai Akad').length;
    const shmPecahCount = items.filter(i => i.unitLegality.shmStatus === 'Pecah').length;

    return {
      totalCount,
      totalPlafond,
      slikKol1Count,
      sp3kApprovedCount,
      readyAkadCount,
      shmPecahCount,
    };
  }, [items]);

  // Filtered list
  const filteredItems = useMemo(() => {
    let result = items;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.customerName.toLowerCase().includes(lower) ||
        item.customerNik.toLowerCase().includes(lower) ||
        item.unitNumber.toLowerCase().includes(lower) ||
        item.projectName.toLowerCase().includes(lower) ||
        item.code.toLowerCase().includes(lower) ||
        (item.notes && item.notes.toLowerCase().includes(lower))
      );
    }

    if (bankFilter !== 'ALL') {
      result = result.filter(item => item.bankName === bankFilter);
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(item => item.sp3kStatus === statusFilter);
    }

    if (slikFilter !== 'ALL') {
      result = result.filter(item => item.docs.slikOjk === slikFilter);
    }

    return result;
  }, [items, searchTerm, bankFilter, statusFilter, slikFilter]);

  // Save updated document from Modal
  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setItems(prev => prev.map(item => item.id === selectedDoc.id ? { ...selectedDoc, updatedAt: new Date().toISOString() } : item));
    setSelectedDoc(null);
    showToast(`Data berkas KPR ${selectedDoc.customerName} berhasil diperbarui.`);
  };

  // Add new document
  const handleAddNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocForm.customerName || !newDocForm.unitNumber) {
      alert('Mohon isi nama konsumen dan nomor unit kavling.');
      return;
    }

    const newId = `leg-${Date.now()}`;
    const newCode = `KPR-2026-${String(items.length + 1).padStart(4, '0')}`;

    const createdItem: LegalDocumentItem = {
      id: newId,
      code: newCode,
      customerName: newDocForm.customerName || 'Konsumen Baru',
      customerPhone: newDocForm.customerPhone || '+62 812-0000-0000',
      customerNik: newDocForm.customerNik || '3201000000000000',
      customerOccupation: newDocForm.customerOccupation || 'Karyawan',
      projectName: newDocForm.projectName || 'Cluster Titanium Residence',
      unitNumber: newDocForm.unitNumber || 'Blok A-00',
      unitType: newDocForm.unitType || 'Tipe Standar',
      price: Number(newDocForm.price) || 650000000,
      paymentMethod: (newDocForm.paymentMethod as any) || 'Mortgage',
      bankName: newDocForm.bankName || 'Bank BTN',
      plafondAmount: Number(newDocForm.plafondAmount) || 585000000,
      interestRate: newDocForm.interestRate || '3.75% Fixed 3 Thn',
      docs: newDocForm.docs || {
        ktpKK: true,
        npwp: true,
        slipGaji: true,
        rekKoran: true,
        skKerja: true,
        slikOjk: 'Kol-1',
      },
      sp3kStatus: (newDocForm.sp3kStatus as any) || 'Draft',
      unitLegality: newDocForm.unitLegality || {
        shmStatus: 'Pecah',
        pbgStatus: 'Lengkap',
        pbbStatus: 'Lunas',
      },
      notaryStatus: (newDocForm.notaryStatus as any) || 'Menunggu Berkas',
      notes: newDocForm.notes || 'Berkas baru diinput.',
      updatedAt: new Date().toISOString(),
    };

    setItems(prev => [createdItem, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Berkas KPR baru untuk ${createdItem.customerName} berhasil ditambahkan.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Kode KPR', 'Nama Konsumen', 'Telepon', 'Unit', 'Bank Rekanan', 'Plafond', 'SLIK OJK', 'Status SP3K', 'Legalitas SHM', 'Status Notaris'];
    const rows = filteredItems.map(item => [
      item.code,
      `"${item.customerName}"`,
      item.customerPhone,
      `"${item.unitNumber} (${item.projectName})"`,
      item.bankName,
      item.plafondAmount,
      item.docs.slikOjk,
      item.sp3kStatus,
      item.unitLegality.shmStatus,
      item.notaryStatus
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_berkas_kpr_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Rekap Berkas KPR berhasil diunduh (CSV).');
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const getBankClass = (bank: string) => {
    if (bank.includes('BTN Syariah')) return styles.bankSyariah;
    if (bank.includes('BTN')) return styles.bankBtn;
    if (bank.includes('Mandiri')) return styles.bankMandiri;
    if (bank.includes('BCA')) return styles.bankBca;
    return styles.bankCash;
  };

  const getSp3kClass = (status: string) => {
    if (status === 'SP3K Terbit') return styles.sp3kTerbit;
    if (status === 'Review Bank') return styles.sp3kReview;
    if (status === 'Diajukan') return styles.sp3kDiajukan;
    return styles.sp3kDraft;
  };

  const getSlikClass = (status: string) => {
    if (status === 'Kol-1') return styles.slikKol1;
    if (status === 'Kol-2') return styles.slikKol2;
    return styles.slikReview;
  };

  return (
    <div className={styles.container}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className={styles.toastSuccess}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <AdminPageHeader
        title="Berkas KPR & Legalitas Kawasan"
        description="Monitoring verifikasi kelengkapan berkas KPR perbankan, riwayat SLIK OJK, persetujuan SP3K, dan legalitas kavling (SHM/PBG/Akad)."
        action={
          <div className={styles.headerActions}>
            <button 
              type="button" 
              className={styles.secondaryBtn}
              onClick={handleExportCSV}
              title="Unduh data dalam format CSV Spreadsheet"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export Rekap CSV</span>
            </button>

            <button 
              type="button" 
              className={styles.primaryBtn}
              onClick={() => setIsAddModalOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Input Berkas KPR</span>
            </button>
          </div>
        }
      />

      {/* Top Metrics KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconWrapper} ${styles.iconNavy}`}>
            <IconFileLegal />
          </div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiLabel}>Total Berkas Aktif</div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{metrics.totalCount} Berkas</span>
              <span className={`${styles.kpiBadge} ${styles.badgeBlue}`}>Pipeline</span>
            </div>
            <div className={styles.kpiSubtext}>Plafond: {formatRupiah(metrics.totalPlafond)}</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconWrapper} ${styles.iconEmerald}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiLabel}>SLIK OJK Kolektibilitas 1</div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{metrics.slikKol1Count} Lolos</span>
              <span className={`${styles.kpiBadge} ${styles.badgeEmerald}`}>100% Aman</span>
            </div>
            <div className={styles.kpiSubtext}>Riwayat BI Checking nasabah lancar</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconWrapper} ${styles.iconAmber}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiLabel}>SP3K Bank Terbit</div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{metrics.sp3kApprovedCount} Terbit</span>
              <span className={`${styles.kpiBadge} ${styles.badgeAmber}`}>Valid</span>
            </div>
            <div className={styles.kpiSubtext}>Disetujui komite pembiayaan bank</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={`${styles.kpiIconWrapper} ${styles.iconPurple}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className={styles.kpiBody}>
            <div className={styles.kpiLabel}>Siap Akad & SHM Pecah</div>
            <div className={styles.kpiValueRow}>
              <span className={styles.kpiValue}>{metrics.readyAkadCount} Unit</span>
              <span className={`${styles.kpiBadge} ${styles.badgeBlue}`}>Notaris</span>
            </div>
            <div className={styles.kpiSubtext}>{metrics.shmPecahCount} sertifikat sudah split per kavling</div>
          </div>
        </div>
      </div>

      {/* Filter Card */}
      <div className={styles.filtersCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Cari Konsumen / Kavling / No KPR</label>
            <input 
              type="text" 
              className={styles.searchInput}
              placeholder="Ketik nama, NIK, Blok A-08, kode KPR..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Bank Rekanan</label>
            <select 
              className={styles.selectInput}
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
            >
              <option value="ALL">Semua Bank</option>
              <option value="Bank BTN">Bank BTN</option>
              <option value="Bank Mandiri">Bank Mandiri</option>
              <option value="BCA Prioritas">BCA Prioritas</option>
              <option value="BTN Syariah">BTN Syariah</option>
              <option value="Cash Keras (BCA Transfer)">Cash Keras</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status SP3K Bank</label>
            <select 
              className={styles.selectInput}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Semua Tahap SP3K</option>
              <option value="Draft">Draft Kelengkapan</option>
              <option value="Diajukan">Diajukan ke Bank</option>
              <option value="Review Bank">Review / Appraisal Bank</option>
              <option value="SP3K Terbit">SP3K Terbit & Valid</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>SLIK OJK (BI Check)</label>
            <select 
              className={styles.selectInput}
              value={slikFilter}
              onChange={(e) => setSlikFilter(e.target.value)}
            >
              <option value="ALL">Semua SLIK OJK</option>
              <option value="Kol-1">Kol-1 (Sangat Lancar)</option>
              <option value="Kol-2">Kol-2 (Dalam Perhatian)</option>
              <option value="Review">Perlu Klarifikasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeaderBar}>
          <div className={styles.tableTitle}>
            <span>Daftar Berkas KPR Konsumen</span>
            <span className={styles.tableCountBadge}>{filteredItems.length} Records</span>
          </div>

          <div className={styles.tableLegend}>
            <span><span className={styles.legendDot} style={{ background: '#10B981' }}></span>Lengkap / Lolos</span>
            <span><span className={styles.legendDot} style={{ background: '#F59E0B' }}></span>Proses Bank</span>
            <span><span className={styles.legendDot} style={{ background: '#EF4444' }}></span>Belum Ada</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Konsumen & No KPR</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Kavling & Nilai Unit</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Bank & Plafond</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Checklist 6 Berkas</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>SP3K & Legal Kavling</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Notaris & Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
                    Tidak ada data berkas KPR yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const cleanPhone = item.customerPhone.replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Halo Bpk/Ibu ${item.customerName}, kami dari Legal & Pembiayaan KPR Derinos Group ingin menyampaikan update berkas unit ${item.unitNumber} (${item.code}).`)}`;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      {/* Konsumen */}
                      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
                        <div className={styles.customerName}>{item.customerName}</div>
                        <div className={styles.customerMeta}>
                          <span className={styles.kprCodePill}>{item.code}</span>
                          <span>•</span>
                          <span>{item.customerOccupation}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                          NIK: {item.customerNik}
                        </div>
                      </td>

                      {/* Kavling */}
                      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
                        <div className={styles.unitName}>{item.unitNumber}</div>
                        <div className={styles.projectName}>{item.projectName}</div>
                        <div className={styles.priceTag}>{formatRupiah(item.price)}</div>
                      </td>

                      {/* Bank & Plafond */}
                      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
                        <span className={`${styles.bankBadge} ${getBankClass(item.bankName)}`}>
                          {item.bankName}
                        </span>
                        {item.plafondAmount > 0 ? (
                          <>
                            <div className={styles.plafondValue}>{formatRupiah(item.plafondAmount)}</div>
                            {item.interestRate && (
                              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>
                                {item.interestRate}
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                            Non-KPR (Cash)
                          </div>
                        )}
                      </td>

                      {/* Checklist Berkas */}
                      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
                        <div className={styles.checklistRow}>
                          <span className={`${styles.docPill} ${item.docs.ktpKK ? styles.docOk : styles.docMissing}`}>
                            {item.docs.ktpKK ? '✓' : '×'} KTP/KK
                          </span>
                          <span className={`${styles.docPill} ${item.docs.npwp ? styles.docOk : styles.docMissing}`}>
                            {item.docs.npwp ? '✓' : '×'} NPWP
                          </span>
                          <span className={`${styles.docPill} ${item.docs.slipGaji ? styles.docOk : styles.docMissing}`}>
                            {item.docs.slipGaji ? '✓' : '×'} Slip Gaji
                          </span>
                          <span className={`${styles.docPill} ${item.docs.rekKoran ? styles.docOk : styles.docMissing}`}>
                            {item.docs.rekKoran ? '✓' : '×'} Rek Koran
                          </span>
                          <span className={`${styles.docPill} ${item.docs.skKerja ? styles.docOk : styles.docMissing}`}>
                            {item.docs.skKerja ? '✓' : '×'} SK Kerja
                          </span>
                          <span className={`${styles.slikPill} ${getSlikClass(item.docs.slikOjk)}`} title={`SLIK OJK: ${item.docs.slikOjk}`}>
                            SLIK: {item.docs.slikOjk}
                          </span>
                        </div>
                      </td>

                      {/* SP3K & Unit Legal */}
                      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
                        <span className={`${styles.sp3kStatusPill} ${getSp3kClass(item.sp3kStatus)}`}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                          {item.sp3kStatus}
                        </span>
                        {item.sp3kDate && (
                          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                            Tgl: {item.sp3kDate}
                          </div>
                        )}
                        <div className={styles.unitLegalityPill}>
                          <span className={styles.unitShmBadge}>SHM: {item.unitLegality.shmStatus}</span>
                          <span>•</span>
                          <span>PBG: {item.unitLegality.pbgStatus}</span>
                        </div>
                      </td>

                      {/* Notaris & Aksi */}
                      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: item.notaryStatus === 'Siap Akad' ? '#047857' : item.notaryStatus === 'Selesai Akad' ? '#1D4ED8' : '#B45309' }}>
                          {item.notaryStatus}
                        </div>
                        {item.akadDate && (
                          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                            Akad: {item.akadDate}
                          </div>
                        )}

                        <div className={styles.actionBtnGroup} style={{ marginTop: '6px' }}>
                          <button 
                            type="button" 
                            className={styles.viewDetailBtn}
                            onClick={() => setSelectedDoc(item)}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <span>Detail & Edit</span>
                          </button>

                          <a 
                            href={waUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.waChatBtn}
                            title="Kirim pesan WhatsApp ke konsumen"
                          >
                            <IconWhatsApp />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Detail & Edit Berkas KPR */}
      {selectedDoc && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedDoc(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <h3 className={styles.modalTitle}>Detail Berkas & Legalitas: {selectedDoc.customerName}</h3>
                <p className={styles.modalSubtitle}>{selectedDoc.code} • {selectedDoc.unitNumber} ({selectedDoc.projectName})</p>
              </div>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setSelectedDoc(null)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDoc}>
              <div className={styles.modalBody}>
                {/* 1. Checklist Berkas Fisik */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    Checklist Dokumen Konsumen
                  </div>
                  <div className={styles.checkGrid}>
                    <label className={styles.checkItem}>
                      <input 
                        type="checkbox" 
                        checked={selectedDoc.docs.ktpKK} 
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          docs: { ...selectedDoc.docs, ktpKK: e.target.checked }
                        })}
                      />
                      <span>KTP Suami/Istri & Kartu Keluarga (KK)</span>
                    </label>

                    <label className={styles.checkItem}>
                      <input 
                        type="checkbox" 
                        checked={selectedDoc.docs.npwp} 
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          docs: { ...selectedDoc.docs, npwp: e.target.checked }
                        })}
                      />
                      <span>NPWP & Bukti Lapor SPT Tahunan</span>
                    </label>

                    <label className={styles.checkItem}>
                      <input 
                        type="checkbox" 
                        checked={selectedDoc.docs.slipGaji} 
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          docs: { ...selectedDoc.docs, slipGaji: e.target.checked }
                        })}
                      />
                      <span>Slip Gaji Asli 3 Bulan Terakhir</span>
                    </label>

                    <label className={styles.checkItem}>
                      <input 
                        type="checkbox" 
                        checked={selectedDoc.docs.rekKoran} 
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          docs: { ...selectedDoc.docs, rekKoran: e.target.checked }
                        })}
                      />
                      <span>Rekening Koran Payroll 3 Bulan</span>
                    </label>

                    <label className={styles.checkItem}>
                      <input 
                        type="checkbox" 
                        checked={selectedDoc.docs.skKerja} 
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          docs: { ...selectedDoc.docs, skKerja: e.target.checked }
                        })}
                      />
                      <span>Surat Keterangan Kerja (SK Pegawai Tetap)</span>
                    </label>
                  </div>
                </div>

                {/* 2. SLIK OJK & Bank Review */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Persetujuan KPR & Hasil BI Checking
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Kolektibilitas SLIK OJK</label>
                      <select 
                        className={styles.selectInput}
                        value={selectedDoc.docs.slikOjk}
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          docs: { ...selectedDoc.docs, slikOjk: e.target.value as any }
                        })}
                      >
                        <option value="Kol-1">Kol-1: Lancar (Rekomendasi Lolos)</option>
                        <option value="Kol-2">Kol-2: DPK (Dalam Perhatian Khusus)</option>
                        <option value="Review">Review Analis Bank</option>
                        <option value="Pending">Pending Pengecekan</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Status SP3K Bank</label>
                      <select 
                        className={styles.selectInput}
                        value={selectedDoc.sp3kStatus}
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          sp3kStatus: e.target.value as any
                        })}
                      >
                        <option value="Draft">Draft Kelengkapan</option>
                        <option value="Diajukan">Diajukan ke Analis</option>
                        <option value="Review Bank">Review & Penilaian Appraisal</option>
                        <option value="SP3K Terbit">SP3K Terbit & Sah</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Plafond KPR Disetujui (Rp)</label>
                      <input 
                        type="number" 
                        className={styles.searchInput}
                        value={selectedDoc.plafondAmount}
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          plafondAmount: Number(e.target.value)
                        })}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Suku Bunga / Promo</label>
                      <input 
                        type="text" 
                        className={styles.searchInput}
                        value={selectedDoc.interestRate || ''}
                        placeholder="Contoh: 3.75% Fixed 3 Thn"
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          interestRate: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Legalitas Tanah Kavling & Notaris */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                    </svg>
                    Legalitas Sertifikat & Notaris Akad
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>Sertifikat Hak Milik (SHM)</label>
                      <select 
                        className={styles.selectInput}
                        value={selectedDoc.unitLegality.shmStatus}
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          unitLegality: { ...selectedDoc.unitLegality, shmStatus: e.target.value as any }
                        })}
                      >
                        <option value="Pecah">Pecah Per Kavling (Ready Akad)</option>
                        <option value="Proses BPN">Proses BPN</option>
                        <option value="Induk">Sertifikat Induk</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Tahapan Notaris</label>
                      <select 
                        className={styles.selectInput}
                        value={selectedDoc.notaryStatus}
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          notaryStatus: e.target.value as any
                        })}
                      >
                        <option value="Menunggu Berkas">Menunggu Kelengkapan Berkas</option>
                        <option value="Siap Akad">Siap Akad (Jadwal Terjadwal)</option>
                        <option value="Selesai Akad">Selesai Akad (AJB Ditandatangani)</option>
                      </select>
                    </div>

                    <div className={styles.formField}>
                      <label>Notaris Rekanan</label>
                      <input 
                        type="text" 
                        className={styles.searchInput}
                        value={selectedDoc.notaryName || ''}
                        placeholder="Nama Notaris / PPAT"
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          notaryName: e.target.value
                        })}
                      />
                    </div>

                    <div className={styles.formField}>
                      <label>Target Tanggal Akad</label>
                      <input 
                        type="date" 
                        className={styles.searchInput}
                        value={selectedDoc.akadDate || ''}
                        onChange={(e) => setSelectedDoc({
                          ...selectedDoc,
                          akadDate: e.target.value
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Catatan Analis */}
                <div className={styles.formField}>
                  <label>Catatan Khusus Verifikator KPR / Legal</label>
                  <textarea 
                    rows={3} 
                    className={styles.searchInput}
                    value={selectedDoc.notes || ''}
                    placeholder="Tuliskan catatan proses appraisal, revisi slip gaji, atau tanggal wawancara bank..."
                    onChange={(e) => setSelectedDoc({
                      ...selectedDoc,
                      notes: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.secondaryBtn}
                  onClick={() => setSelectedDoc(null)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryBtn}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tambah Berkas Baru */}
      {isAddModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsAddModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <h3 className={styles.modalTitle}>Input Berkas KPR & Konsumen Baru</h3>
                <p className={styles.modalSubtitle}>Pemberkasan pengajuan kredit pemilikan rumah konsumen baru</p>
              </div>
              <button 
                type="button" 
                className={styles.modalCloseBtn}
                onClick={() => setIsAddModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddNewDoc}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>Nama Konsumen *</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.searchInput}
                      placeholder="Nama lengkap pemohon KPR"
                      value={newDocForm.customerName}
                      onChange={(e) => setNewDocForm({ ...newDocForm, customerName: e.target.value })}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Nomor Telepon (WhatsApp) *</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.searchInput}
                      placeholder="+62 812-xxxx-xxxx"
                      value={newDocForm.customerPhone}
                      onChange={(e) => setNewDocForm({ ...newDocForm, customerPhone: e.target.value })}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>NIK Konsumen</label>
                    <input 
                      type="text" 
                      className={styles.searchInput}
                      placeholder="16 Digit NIK KTP"
                      value={newDocForm.customerNik}
                      onChange={(e) => setNewDocForm({ ...newDocForm, customerNik: e.target.value })}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Pekerjaan / Instansi</label>
                    <input 
                      type="text" 
                      className={styles.searchInput}
                      placeholder="Karyawan Swasta / BUMN / PNS"
                      value={newDocForm.customerOccupation}
                      onChange={(e) => setNewDocForm({ ...newDocForm, customerOccupation: e.target.value })}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Cluster Proyek</label>
                    <select 
                      className={styles.selectInput}
                      value={newDocForm.projectName}
                      onChange={(e) => setNewDocForm({ ...newDocForm, projectName: e.target.value })}
                    >
                      <option value="Cluster Titanium Residence">Cluster Titanium Residence</option>
                      <option value="Grand Hill Residence">Grand Hill Residence</option>
                      <option value="Harmoni Gardenia Villa">Harmoni Gardenia Villa</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label>Nomor Unit Kavling *</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.searchInput}
                      placeholder="Contoh: Blok B-05"
                      value={newDocForm.unitNumber}
                      onChange={(e) => setNewDocForm({ ...newDocForm, unitNumber: e.target.value })}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>Bank Pengajuan KPR</label>
                    <select 
                      className={styles.selectInput}
                      value={newDocForm.bankName}
                      onChange={(e) => setNewDocForm({ ...newDocForm, bankName: e.target.value })}
                    >
                      <option value="Bank BTN">Bank BTN</option>
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="BCA Prioritas">BCA Prioritas</option>
                      <option value="BTN Syariah">BTN Syariah</option>
                      <option value="Cash Keras (BCA Transfer)">Cash Keras</option>
                    </select>
                  </div>

                  <div className={styles.formField}>
                    <label>Estimasi Plafond KPR (Rp)</label>
                    <input 
                      type="number" 
                      className={styles.searchInput}
                      value={newDocForm.plafondAmount}
                      onChange={(e) => setNewDocForm({ ...newDocForm, plafondAmount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label>Catatan Awal</label>
                  <textarea 
                    rows={2} 
                    className={styles.searchInput}
                    placeholder="Kelengkapan dokumen awal saat booking..."
                    value={newDocForm.notes}
                    onChange={(e) => setNewDocForm({ ...newDocForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.secondaryBtn}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryBtn}
                >
                  Simpan & Buat Berkas KPR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
