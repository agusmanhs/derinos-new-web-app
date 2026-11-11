'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  IconCockpit,
  IconCRM,
  IconUnits,
  IconWhatsApp,
  IconFileLegal,
  IconClock,
  IconArrowUpRight,
  IconProjects,
  IconConstruction,
} from '@/components/ui/Icon/AdminIcons';
import styles from './AdminDashboardClient.module.css';

export interface DashboardStats {
  totalProjects: number;
  totalUnits: number;
  availableUnits: number;
  bookedUnits: number;
  soldUnits: number;
  totalCustomers: number;
  totalLeads: number;
  leadStageCounts: {
    New: number;
    Contacted: number;
    Qualified: number;
    Lost: number;
  };
  totalSales: number;
  activeBookingsCount: number;
  totalPipelineValue: number;
  thisMonthTransactionCount: number;
  thisMonthTransactionValue: number;
  conversionRate: number;
}

export interface DashboardLeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  projectId: string | null;
  projectTitle: string | null;
  propertyType: string | null;
  budget: string | null;
  message: string;
  source: string;
  status: string;
  createdAt: string;
}

export interface DashboardUnitItem {
  id: string;
  projectId: string;
  projectTitle: string;
  projectSlug: string;
  phaseName: string | null;
  unitNumber: string;
  typeName: string;
  landSize: number;
  buildingSize: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  constructionProgress: number;
  statusName: string;
  statusColorHex: string;
  customerName: string | null;
}

export interface DashboardProjectSummary {
  id: string;
  title: string;
  slug: string;
  location: string;
  status: string;
  overallProgress: number;
  targetCompletion: string;
  totalUnitsCount: number;
  availableUnitsCount: number;
}

export interface DashboardActivityItem {
  id: string;
  type: 'status' | 'construction' | 'booking';
  title: string;
  description: string;
  createdAt: string;
}

interface RecentBookingItem {
  id: string;
  projectTitle: string;
  unitNumber: string;
  price: number;
  status: string;
  customerName: string;
  date: string;
}

interface RecentCustomerItem {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
}

interface ChartPoint {
  month: string;
  revenue: number;
}

interface UnitStatusPoint {
  name: string;
  value: number;
  colorHex: string;
}

interface Props {
  stats: DashboardStats;
  projects: DashboardProjectSummary[];
  units: DashboardUnitItem[];
  recentLeads: DashboardLeadItem[];
  activityFeed: DashboardActivityItem[];
  recentBookings: RecentBookingItem[];
  recentCustomers: RecentCustomerItem[];
  chartData: ChartPoint[];
  unitStatusData: UnitStatusPoint[];
}

function getInitials(name: string): string {
  const parts = (name || 'L').trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function normalizeWaPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

function formatDateID(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

function getCellClass(statusName: string): string {
  const lower = statusName.toLowerCase();
  if (lower.includes('avail') || lower.includes('ready') || lower.includes('tersedia')) {
    return styles.cellReady;
  }
  if (lower.includes('sold') || lower.includes('terjual') || lower.includes('akad') || lower.includes('lunas')) {
    return styles.cellTerjual;
  }
  if (lower.includes('bangun') || lower.includes('progres') || lower.includes('construct')) {
    return styles.cellBangun;
  }
  return styles.cellHold;
}

function getLeadBadgeInfo(status: string): { label: string; className: string; avatarClass: string } {
  switch (status) {
    case 'New':
      return { label: 'Inquiry Baru', className: styles.badgeUrgent, avatarClass: styles.avatarPink };
    case 'Contacted':
      return { label: 'Sedang Dihubungi', className: styles.badgeHot, avatarClass: styles.avatarAmber };
    case 'Qualified':
      return { label: 'Prospek Potensial', className: styles.badgeSuccess, avatarClass: styles.avatarGreen };
    case 'Lost':
    default:
      return { label: status || 'Lost', className: styles.statusChipSlate, avatarClass: styles.avatarAmber };
  }
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function DashboardAreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(payload[0]?.value || 0)}
        </p>
      </div>
    );
  }
  return null;
}

export function AdminDashboardClient({
  stats,
  projects = [],
  units = [],
  recentLeads = [],
  activityFeed = [],
  recentBookings = [],
  recentCustomers = [],
  chartData = [],
  unitStatusData = [],
}: Props) {
  const [activeStage, setActiveStage] = useState<'all' | 'New' | 'Contacted' | 'Qualified' | 'Lost'>('all');
  const [leadProjectFilter, setLeadProjectFilter] = useState<string>('all');
  const [selectedMatrixProjectId, setSelectedMatrixProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id || '');

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '')} M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1).replace(/\.?0+$/, '')} Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const availableRatio =
    stats.totalUnits > 0 ? Math.round((stats.availableUnits / stats.totalUnits) * 100) : 0;

  const sixMonthRevenueTotal = useMemo(
    () => chartData.reduce((sum, item) => sum + (item.revenue || 0), 0),
    [chartData]
  );

  // Filter Leads berdasarkan Proyek terpilih
  const leadsByProject = useMemo(() => {
    if (leadProjectFilter === 'all') return recentLeads;
    return recentLeads.filter((l) => l.projectId === leadProjectFilter);
  }, [recentLeads, leadProjectFilter]);

  const stageCountsForView = useMemo(() => {
    if (leadProjectFilter === 'all') {
      return {
        all: stats.totalLeads,
        New: stats.leadStageCounts.New,
        Contacted: stats.leadStageCounts.Contacted,
        Qualified: stats.leadStageCounts.Qualified,
        Lost: stats.leadStageCounts.Lost,
      };
    }
    return {
      all: leadsByProject.length,
      New: leadsByProject.filter((l) => l.status === 'New').length,
      Contacted: leadsByProject.filter((l) => l.status === 'Contacted').length,
      Qualified: leadsByProject.filter((l) => l.status === 'Qualified').length,
      Lost: leadsByProject.filter((l) => l.status === 'Lost').length,
    };
  }, [leadProjectFilter, leadsByProject, stats]);

  const visibleLeads = useMemo(() => {
    const stageFiltered =
      activeStage === 'all'
        ? leadsByProject
        : leadsByProject.filter((l) => l.status === activeStage);
    return stageFiltered.slice(0, 5);
  }, [leadsByProject, activeStage]);

  // Matrix Unit Monitor per Proyek terpilih
  const activeMatrixProject = useMemo(
    () => projects.find((p) => p.id === selectedMatrixProjectId) || projects[0] || null,
    [projects, selectedMatrixProjectId]
  );

  const unitsInMatrixProject = useMemo(() => {
    if (!activeMatrixProject) return units;
    return units.filter((u) => u.projectId === activeMatrixProject.id);
  }, [units, activeMatrixProject]);

  const matrixSampleUnits = useMemo(
    () => unitsInMatrixProject.slice(0, 12),
    [unitsInMatrixProject]
  );

  const selectedUnit = useMemo(() => {
    if (unitsInMatrixProject.length === 0) return null;
    return (
      unitsInMatrixProject.find((u) => u.id === selectedUnitId) ||
      unitsInMatrixProject[0] ||
      null
    );
  }, [unitsInMatrixProject, selectedUnitId]);

  const matrixCounts = useMemo(() => {
    let ready = 0;
    let hold = 0;
    let sold = 0;
    for (const u of unitsInMatrixProject) {
      const lower = u.statusName.toLowerCase();
      if (lower.includes('avail') || lower.includes('ready') || lower.includes('tersedia')) {
        ready += 1;
      } else if (lower.includes('sold') || lower.includes('terjual') || lower.includes('akad') || lower.includes('lunas')) {
        sold += 1;
      } else {
        hold += 1;
      }
    }
    return { ready, hold, sold };
  }, [unitsInMatrixProject]);

  return (
    <div className={styles.dashboard}>
      {/* 1. Header Title & Subtitle */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <div className={styles.cockpitBadge}>
            <IconCockpit />
            <span>EXECUTIVE COCKPIT CRM</span>
          </div>
          <h1 className={styles.pageTitle}>Dashboard Operasional Properti</h1>
          <p className={styles.pageSubtitle}>
            Monitoring real-time transaksi penjualan, stok kavling aktif, leads CRM, dan progres proyek langsung dari database.
          </p>
        </div>
      </div>

      {/* 2. TOP 5 EXECUTIVE KPI CARDS (100% Real Data) */}
      <div className={styles.kpiGrid}>
        {/* Card 1: Total Nilai Transaksi & Booking */}
        <div className={`${styles.kpiCard} ${styles.kpiCardHighlight}`}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>NILAI TRANSAKSI AKTIF</span>
            <span className={styles.trendBadgePositive}>
              {stats.activeBookingsCount} Booking
            </span>
          </div>
          <div className={styles.kpiMainValue}>{formatCurrency(stats.totalPipelineValue)}</div>
          <div className={styles.kpiSubText}>
            {stats.totalSales} sales deal • {stats.bookedUnits} hold/booking
          </div>
        </div>

        {/* Card 2: Total Leads CRM */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>TOTAL LEADS CRM</span>
            <div className={styles.kpiIconBlue}><IconCRM /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValue}>{stats.totalLeads}</span>
            {stats.leadStageCounts.New > 0 && (
              <span className={styles.urgentBadge}>{stats.leadStageCounts.New} Baru</span>
            )}
          </div>
          <div className={styles.kpiSubText}>
            {stats.leadStageCounts.Qualified} Qualified • {stats.leadStageCounts.Contacted} Dihubungi
          </div>
        </div>

        {/* Card 3: Kavling Tersedia */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>KAVLING TERSEDIA</span>
            <div className={styles.kpiIconGreen}><IconUnits /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValueGreen}>{stats.availableUnits}</span>
            <span className={styles.kpiUnitTarget}>dari {stats.totalUnits} Total Kavling</span>
          </div>
          <div className={styles.kpiProgressBar}>
            <div
              className={styles.kpiProgressFillGreen}
              style={{ width: `${availableRatio}%` }}
            />
          </div>
        </div>

        {/* Card 4: Transaksi Bulan Ini */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>TRANSAKSI BULAN INI</span>
            <div className={styles.kpiIconPurple}><IconFileLegal /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValue}>{stats.thisMonthTransactionCount} Unit</span>
            <span className={styles.purpleChip}>{formatCurrency(stats.thisMonthTransactionValue)}</span>
          </div>
          <div className={styles.kpiSubText}>Deal &amp; booking bulan berjalan</div>
        </div>

        {/* Card 5: Konversi & Konsumen */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>RASIO KONVERSI LEADS</span>
            <div className={styles.kpiIconAmber}><IconArrowUpRight /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValue}>{stats.conversionRate}%</span>
            <span className={styles.trendBadgePositive}>{stats.totalCustomers} Konsumen</span>
          </div>
          <div className={styles.kpiSubText}>
            {stats.totalProjects} proyek aktif • {stats.soldUnits} terjual/akad
          </div>
        </div>
      </div>

      {/* 3. FEATURED CHARTS SECTION */}
      <div className={styles.chartsGrid}>
        {/* Chart 1: Revenue & Booking Trend */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitleWithIcon}>
                <span className={styles.amberIcon}><IconArrowUpRight /></span>
                <h2 className={styles.cardTitle}>Tren Omzet &amp; Transaksi (6 Bulan Terakhir)</h2>
              </div>
              <p className={styles.cardSubtitle}>
                Akumulasi nilai transaksi booking aktif dan closing penjualan per bulan
              </p>
            </div>
            <div className={styles.chartHeaderBadge}>
              <span className={styles.trendDot} />
              <span>Total 6 Bln: {formatCurrency(sixMonthRevenueTotal)}</span>
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(val) =>
                    val >= 1_000_000_000
                      ? `Rp${(val / 1_000_000_000).toFixed(1)}M`
                      : val >= 1_000_000
                        ? `Rp${Math.round(val / 1_000_000)}Jt`
                        : `Rp${val}`
                  }
                />
                <RechartsTooltip content={<DashboardAreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F59E0B"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#0B192C', stroke: '#F59E0B', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Unit Status Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardTitleWithIcon}>
                <span className={styles.amberIcon}><IconProjects /></span>
                <h2 className={styles.cardTitle}>Distribusi Status Stok Kavling</h2>
              </div>
              <p className={styles.cardSubtitle}>
                Komposisi seluruh kavling terdaftar menurut status saat ini
              </p>
            </div>
            <Link href="/admin/properties" className={styles.viewInventoryLink}>
              Kelola Unit →
            </Link>
          </div>
          <div className={styles.chartWrapper}>
            {unitStatusData.length === 0 ? (
              <div className={styles.emptyCockpitBox} style={{ marginTop: 40 }}>
                Belum ada unit kavling yang terdaftar di database.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={unitStatusData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} width={125} />
                  <RechartsTooltip
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26}>
                    {unitStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.colorHex || '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 4. MAIN COCKPIT WORKSPACE (2 Columns) */}
      <div className={styles.cockpitWorkspace}>
        {/* LEFT COLUMN: Pipeline Stage Monitor & Activity Feed */}
        <div className={styles.leftColumn}>
          {/* Pipeline Stage Monitor Card (100% Real Leads) */}
          <div className={styles.cockpitCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitleWithIcon}>
                  <span className={styles.amberIcon}><IconCockpit /></span>
                  <h2 className={styles.cardTitle}>Pipeline Stage Monitor Prospek</h2>
                </div>
                <p className={styles.cardSubtitle}>
                  Monitor daftar prospek masuk langsung dari formulir website &amp; tim sales.
                </p>
              </div>
              <div className={styles.cardHeaderActions}>
                <select
                  className={styles.filterSelect}
                  aria-label="Filter prospek berdasarkan proyek"
                  value={leadProjectFilter}
                  onChange={(e) => setLeadProjectFilter(e.target.value)}
                >
                  <option value="all">Semua Proyek</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <Link href="/admin/leads" className={styles.filterBtn} style={{ textDecoration: 'none' }}>
                  Kelola CRM →
                </Link>
              </div>
            </div>

            {/* Stage Filter Tabs (Mapped to Real Lead Statuses) */}
            <div className={styles.stageTabs}>
              <button
                type="button"
                onClick={() => setActiveStage('all')}
                className={`${styles.stageTab} ${activeStage === 'all' ? styles.stageTabActive : ''}`}
              >
                <span>Semua</span>
                <span className={styles.stageCountMuted}>{stageCountsForView.all}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('New')}
                className={`${styles.stageTab} ${activeStage === 'New' ? styles.stageTabActive : ''}`}
              >
                <span>Inquiry Baru</span>
                <span className={stageCountsForView.New > 0 ? styles.stageCountRed : styles.stageCountMuted}>
                  {stageCountsForView.New}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('Contacted')}
                className={`${styles.stageTab} ${activeStage === 'Contacted' ? styles.stageTabActive : ''}`}
              >
                <span>Dihubungi</span>
                <span className={styles.stageCountMuted}>{stageCountsForView.Contacted}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('Qualified')}
                className={`${styles.stageTab} ${activeStage === 'Qualified' ? styles.stageTabActive : ''}`}
              >
                <span>Qualified</span>
                <span className={styles.stageCountMuted}>{stageCountsForView.Qualified}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStage('Lost')}
                className={`${styles.stageTab} ${activeStage === 'Lost' ? styles.stageTabActive : ''}`}
              >
                <span>Lost</span>
                <span className={styles.stageCountMuted}>{stageCountsForView.Lost}</span>
              </button>
            </div>

            {/* Prospect Lead Cards List */}
            <div className={styles.leadsList}>
              {visibleLeads.length === 0 ? (
                <div className={styles.emptyCockpitBox}>
                  Belum ada data prospek pada filter tahap ini. Calon pembeli yang mengisi form konsultasi di website akan langsung muncul di sini.
                </div>
              ) : (
                visibleLeads.map((lead) => {
                  const badgeInfo = getLeadBadgeInfo(lead.status);
                  const waPhone = normalizeWaPhone(lead.phone);
                  const waText = encodeURIComponent(
                    `Halo ${lead.name}, terima kasih telah menghubungi Derinos Group${lead.projectTitle ? ` terkait proyek ${lead.projectTitle}` : ''}.`
                  );

                  return (
                    <div key={lead.id} className={styles.leadCard}>
                      <div className={styles.leadMain}>
                        <div className={`${styles.leadAvatar} ${badgeInfo.avatarClass}`}>
                          {getInitials(lead.name)}
                        </div>
                        <div className={styles.leadDetails}>
                          <div className={styles.leadTopRow}>
                            <div className={styles.leadNameGroup}>
                              <h3 className={styles.leadName}>{lead.name}</h3>
                              <span className={badgeInfo.className}>{badgeInfo.label}</span>
                            </div>
                            <div className={styles.leadScoreGroup}>
                              <span className={styles.leadSource}>
                                {lead.source} • {formatDateID(lead.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className={styles.leadMetaRow}>
                            <span className={styles.leadUnit}>
                              {lead.projectTitle || 'Minat Proyek Umum'}
                            </span>
                            {lead.propertyType && (
                              <>
                                <span className={styles.metaDot}>•</span>
                                <span>{lead.propertyType}</span>
                              </>
                            )}
                            {lead.budget && (
                              <>
                                <span className={styles.metaDot}>•</span>
                                <span className={styles.leadPrice}>Budget: {lead.budget}</span>
                              </>
                            )}
                          </div>

                          <div className={styles.quoteBox}>
                            <p className={styles.quoteText}>
                              {lead.message ? `"${lead.message}"` : 'Belum ada pesan atau catatan tambahan dari calon pembeli.'}
                            </p>
                            <span className={styles.picMuted}>{lead.email || lead.phone}</span>
                          </div>

                          <div className={styles.leadActionRow}>
                            <div className={styles.slaCounter}>
                              <IconClock />
                              <span>Kontak: <strong>{lead.phone || '-'}</strong></span>
                            </div>
                            <div className={styles.actionButtonsGroup}>
                              <Link
                                href="/admin/leads"
                                className={styles.btnSecondary}
                                style={{ textDecoration: 'none' }}
                              >
                                Kelola Status
                              </Link>
                              {waPhone && (
                                <a
                                  href={`https://wa.me/${waPhone}?text=${waText}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.btnWhatsApp}
                                >
                                  <IconWhatsApp />
                                  <span>Hubungi WA</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Log Aktivitas Operasional Real */}
          <div className={styles.cockpitCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleWithIcon}>
                <span className={styles.slateIcon}><IconClock /></span>
                <h2 className={styles.cardTitle}>Log Aktivitas Operasional Terbaru</h2>
              </div>
              <span className={styles.realtimePill}>Live Database Feed</span>
            </div>

            {activityFeed.length === 0 ? (
              <div className={styles.emptyCockpitBox}>
                Belum ada riwayat perubahan status kavling, booking, atau progres konstruksi terbaru.
              </div>
            ) : (
              <div className={styles.activityFeed}>
                {activityFeed.map((item) => (
                  <div key={item.id} className={styles.feedItem}>
                    <div
                      className={
                        item.type === 'construction'
                          ? styles.feedIconGreen
                          : item.type === 'booking'
                            ? styles.feedIconAmber
                            : styles.feedIconBlue
                      }
                    >
                      {item.type === 'construction' ? (
                        <IconConstruction />
                      ) : item.type === 'booking' ? (
                        <IconFileLegal />
                      ) : (
                        <IconUnits />
                      )}
                    </div>
                    <div className={styles.feedContent}>
                      <div className={styles.feedHeader}>
                        <strong className={styles.feedAgent}>{item.title}</strong>
                        <span className={styles.feedTime}>{formatDateID(item.createdAt)}</span>
                      </div>
                      <p className={styles.feedDesc}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.feedFooter}>
              <span>Menampilkan {activityFeed.length} aktivitas operasional terbaru.</span>
              <Link href="/admin/construction" className={styles.feedLink}>
                Lihat Progres Konstruksi →
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Site Plan Matrix & Ringkasan Proyek */}
        <div className={styles.rightColumn}>
          {/* Site Plan & Unit Matrix Monitor Card (100% Real Units) */}
          <div className={styles.cockpitCard}>
            <div className={styles.cardHeader}>
              <div>
                <div className={styles.cardTitleWithIcon}>
                  <span className={styles.amberIcon}><IconUnits /></span>
                  <h2 className={styles.cardTitle}>Monitor Kavling &amp; Unit Proyek</h2>
                </div>
                <p className={styles.cardSubtitle}>
                  Pantauan kavling nyata pada proyek {activeMatrixProject?.title || 'aktif'}.
                </p>
              </div>
              <div className={styles.cardHeaderActions}>
                {projects.length > 0 && (
                  <select
                    className={styles.filterSelect}
                    aria-label="Pilih proyek untuk matriks unit"
                    value={activeMatrixProject?.id || ''}
                    onChange={(e) => {
                      setSelectedMatrixProjectId(e.target.value);
                      setSelectedUnitId('');
                    }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                )}
                <span className={styles.totalUnitsBadge}>
                  Total: {unitsInMatrixProject.length} Unit
                </span>
              </div>
            </div>

            {/* Matrix Blueprint Visual Box */}
            <div className={styles.matrixContainer}>
              <div className={styles.matrixHeaderRow}>
                <span className={styles.matrixBoulevard}>
                  ● {activeMatrixProject?.title || 'Belum Ada Proyek'}
                </span>
                <span className={styles.matrixCode}>
                  {activeMatrixProject ? `PROGRES ${Math.round(activeMatrixProject.overallProgress)}%` : 'DB_LIVE'}
                </span>
              </div>

              {matrixSampleUnits.length === 0 ? (
                <div style={{ padding: '22px 12px', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
                  Belum ada unit terdaftar untuk proyek ini.
                </div>
              ) : (
                <div className={styles.unitMatrixGrid}>
                  {matrixSampleUnits.map((unit) => {
                    const isSelected = selectedUnit?.id === unit.id;
                    return (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedUnitId(unit.id)}
                        className={`${styles.unitCell} ${getCellClass(unit.statusName)} ${isSelected ? styles.cellSelected : ''}`}
                        title={`${unit.unitNumber} • ${unit.typeName} (${unit.statusName})`}
                      >
                        <div className={styles.unitCode}>{unit.unitNumber.toUpperCase()}</div>
                        <div className={styles.unitStatusText}>
                          {unit.statusName.toUpperCase()}
                        </div>
                        <div className={styles.unitSubTruncate}>
                          {Math.round(unit.constructionProgress)}% • {unit.typeName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Matrix Legend (Exact Project Counts) */}
              <div className={styles.matrixLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.dotGreen} /> Ready ({matrixCounts.ready})
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.dotAmber} /> Booking / Proses ({matrixCounts.hold})
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.dotSlate} /> Terjual / Akad ({matrixCounts.sold})
                </span>
              </div>
            </div>

            {/* Active Unit Detail Quick Info */}
            <div className={styles.activeUnitSection}>
              <h4 className={styles.sectionHeader}>INFORMASI DETAIL KAVLING AKTIF</h4>

              {!selectedUnit ? (
                <div className={styles.emptyCockpitBox}>
                  Pilih unit di atas atau tambahkan kavling melalui Master Proyek.
                </div>
              ) : (
                <div className={styles.unitDetailCard}>
                  <div className={styles.unitDetailHeader}>
                    <span className={styles.unitBadgeCode}>
                      {selectedUnit.unitNumber.toUpperCase()}
                    </span>
                    <strong className={styles.unitNameTitle}>
                      {selectedUnit.typeName} ({selectedUnit.projectTitle})
                    </strong>
                    <span
                      className={styles.badgeReadyStock}
                      style={{
                        backgroundColor: `${selectedUnit.statusColorHex}20`,
                        color: selectedUnit.statusColorHex,
                      }}
                    >
                      {selectedUnit.statusName.toUpperCase()}
                    </span>
                  </div>

                  <div className={styles.specsGrid}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Luas Bangunan / Tanah:</span>
                      <strong className={styles.specValueGreen}>
                        LB {selectedUnit.buildingSize}m² / LT {selectedUnit.landSize}m²
                      </strong>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Harga Pricelist:</span>
                      <strong className={styles.specValuePrice}>
                        Rp {selectedUnit.price.toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Progres Konstruksi:</span>
                      <strong className={styles.specValueBlue}>
                        {Math.round(selectedUnit.constructionProgress)}% Selesai
                      </strong>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Konsumen / Pemilik:</span>
                      <strong className={styles.specValuePrice}>
                        {selectedUnit.customerName || 'Unit Tersedia'}
                      </strong>
                    </div>
                  </div>

                  {selectedUnit.projectSlug && (
                    <Link
                      href={`/admin/projects/${selectedUnit.projectSlug}`}
                      className={styles.detailCtaLink}
                    >
                      Buka Site Plan {selectedUnit.projectTitle} →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ringkasan Proyek Aktif & Pintasan Cepat (Real Database Card) */}
          <div className={styles.whatsappCard}>
            <div className={styles.waCardHeader}>
              <div className={styles.waIconBox}>
                <IconProjects />
              </div>
              <div className={styles.waHeaderText}>
                <h3 className={styles.waTitle}>Ringkasan Proyek &amp; Pintasan Cepat</h3>
                <p className={styles.waSubtitle}>
                  Pantau progres tiap kawasan proyek aktif dan akses modul inti dengan cepat.
                </p>
              </div>
              <div className={styles.waStatusBadge}>
                <span className={styles.waDot} />
                <span>{projects.length} Proyek Aktif</span>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className={styles.templateCard}>
                <h4 className={styles.templateTitle}>Belum Ada Proyek Aktif</h4>
                <p className={styles.templateSnippet}>
                  Tambahkan proyek pertama Anda di menu Master Proyek untuk mulai mengelola tipe rumah, unit kavling, dan site plan SVG.
                </p>
              </div>
            ) : (
              projects.slice(0, 3).map((prj) => (
                <div key={prj.id} className={styles.templateCard}>
                  <div className={styles.templateHeader}>
                    <span className={styles.templateBadge}>{prj.status.toUpperCase()}</span>
                    <span className={styles.templateSent}>
                      {prj.availableUnitsCount} / {prj.totalUnitsCount} Unit Tersedia
                    </span>
                  </div>
                  <h4 className={styles.templateTitle}>{prj.title}</h4>
                  <p className={styles.templateSnippet}>
                    {prj.location} • Target selesai: {prj.targetCompletion || '-'}
                  </p>
                  <div className={styles.quotaBar} style={{ marginTop: 4 }}>
                    <div
                      className={styles.quotaFill}
                      style={{ width: `${Math.min(100, Math.max(0, prj.overallProgress))}%` }}
                    />
                  </div>
                  <div className={styles.templateActionRow}>
                    <span className={styles.templateTarget}>
                      Progres Kawasan: <strong>{Math.round(prj.overallProgress)}%</strong>
                    </span>
                    <Link
                      href={`/admin/projects/${prj.slug}`}
                      className={styles.btnBroadcastAmber}
                      style={{ textDecoration: 'none' }}
                    >
                      <span>Buka Site Plan →</span>
                    </Link>
                  </div>
                </div>
              ))
            )}

            <div className={styles.waFooterActions}>
              <Link href="/admin/properties" className={styles.shortcutLinkSecondary}>
                Kelola Stok Unit
              </Link>
              <Link href="/admin/projects" className={styles.shortcutLinkPrimary}>
                Master Proyek &amp; Tipe →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT BOOKINGS & CUSTOMERS SECTION */}
      <div className={styles.bottomGrid}>
        <div className={styles.listCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Recent Bookings &amp; Transaksi</h2>
              <p className={styles.cardSubtitle}>5 transaksi booking kavling terbaru dari konsumen</p>
            </div>
            <Link href="/admin/bookings" className={styles.viewAll}>Lihat Semua Bookings →</Link>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.modernTable}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Project / Unit</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan={4} className={styles.emptyText}>Belum ada booking transaksi terbaru.</td></tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td className={styles.fw500}>{b.customerName}</td>
                      <td>
                        <div className={styles.tdStack}>
                          <span className={styles.fw500}>{b.projectTitle}</span>
                          <span className={styles.textMuted}>{b.unitNumber.toUpperCase()}</span>
                        </div>
                      </td>
                      <td className={styles.fw500}>Rp {b.price.toLocaleString('id-ID')}</td>
                      <td>
                        <span className={`${styles.badge} ${b.status === 'Confirmed' ? styles.badgeSuccess : styles.badgeWarning}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.listCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Customer Baru</h2>
              <p className={styles.cardSubtitle}>Calon pembeli terdaftar terbaru</p>
            </div>
            <Link href="/admin/customers" className={styles.viewAll}>Semua Customer →</Link>
          </div>
          <div className={styles.activityList}>
            {recentCustomers.length === 0 ? (
              <div className={styles.emptyText}>Belum ada customer terdaftar.</div>
            ) : (
              recentCustomers.map((c) => (
                <div key={c.id} className={styles.activityItem}>
                  <div className={styles.avatarCircle}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityTitle}>{c.name}</div>
                    <div className={styles.activityDesc}>{c.phone || c.email || 'Belum ada kontak'}</div>
                  </div>
                  <div className={styles.activityTime}>
                    {formatDateID(c.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
