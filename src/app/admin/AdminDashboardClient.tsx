'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  IconCockpit, 
  IconCRM, 
  IconUnits, 
  IconWhatsApp, 
  IconFileLegal, 
  IconClock, 
  IconFilter, 
  IconArrowUpRight 
} from '@/components/ui/Icon/AdminIcons';
import { BedIcon, BathIcon, CarIcon, AreaIcon, CheckIcon, ShieldCheckIcon, PhoneIcon } from '@/components/ui/Icon/LandingIcons';
import styles from './AdminDashboardClient.module.css';

export function AdminDashboardClient({ 
  stats, 
  recentBookings = [], 
  recentCustomers = [], 
  chartData = [],
  unitStatusData = [],
  recentLeads = [],
  sampleUnits = []
}: any) {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'analytics'>('cockpit');
  const [activeStage, setActiveStage] = useState('inquiry');
  const [activeUnitMatrix, setActiveUnitMatrix] = useState('A-08');

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)} M`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)} Jt`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const totalUnitsValue = unitStatusData.reduce((acc: number, item: any) => acc + item.value, 0) || stats.totalUnits || 48;
  const soldUnitsValue = unitStatusData.find((u: any) => u.name.toLowerCase().includes('sold') || u.name.toLowerCase().includes('terjual') || u.name.toLowerCase().includes('book'))?.value || 36;
  const availableUnitsValue = Math.max(0, totalUnitsValue - soldUnitsValue) || 24;
  const pipelineValue = stats.totalRevenue > 0 ? stats.totalRevenue : 48600000000;

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipValue}>
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.dashboard}>
      {/* Top Header & View Switcher */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <div className={styles.cockpitBadge}>
            <IconCockpit />
            <span>EXECUTIVE COCKPIT CRM</span>
          </div>
          <h1 className={styles.pageTitle}>Dashboard Operasional Properti</h1>
          <p className={styles.pageSubtitle}>
            Monitoring real-time transaksi penjualan, kavling aktif, respon leads, dan automasi WhatsApp.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.tabSwitcher}>
          <button 
            type="button" 
            onClick={() => setActiveTab('cockpit')}
            className={`${styles.tabBtn} ${activeTab === 'cockpit' ? styles.tabActive : ''}`}
          >
            <IconCockpit />
            <span>Executive Cockpit</span>
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('analytics')}
            className={`${styles.tabBtn} ${activeTab === 'analytics' ? styles.tabActive : ''}`}
          >
            <IconArrowUpRight />
            <span>Grafik & Laporan Penjualan</span>
          </button>
        </div>
      </div>

      {/* 1. TOP 5 EXECUTIVE KPI CARDS */}
      <div className={styles.kpiGrid}>
        {/* Card 1: Total Pipeline Value */}
        <div className={`${styles.kpiCard} ${styles.kpiCardHighlight}`}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>TOTAL PIPELINE VALUE</span>
            <span className={styles.trendBadgePositive}>↑ +18.4% vs bln lalu</span>
          </div>
          <div className={styles.kpiMainValue}>{formatCurrency(pipelineValue)}</div>
          <div className={styles.kpiSubText}>Estimasi nilai 148 prospek aktif</div>
        </div>

        {/* Card 2: Leads Baru Aktif */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>LEADS BARU AKTIF</span>
            <div className={styles.kpiIconBlue}><IconCRM /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValue}>{stats.totalLeads > 0 ? stats.totalLeads : 148}</span>
            <span className={styles.urgentBadge}>8 Urgent SLA</span>
          </div>
          <div className={styles.kpiSubText}>Inquiry masuk minggu ini</div>
        </div>

        {/* Card 3: Kavling Tersedia */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>KAVLING TERSEDIA</span>
            <div className={styles.kpiIconGreen}><IconUnits /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValueGreen}>{availableUnitsValue}</span>
            <span className={styles.kpiUnitTarget}>dari {totalUnitsValue} Total Kavling</span>
          </div>
          <div className={styles.kpiProgressBar}>
            <div className={styles.kpiProgressFillGreen} style={{ width: `${Math.round((availableUnitsValue / totalUnitsValue) * 100)}%` }} />
          </div>
        </div>

        {/* Card 4: SP3K & Akad Bulan Ini */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>SP3K & AKAD BULAN INI</span>
            <div className={styles.kpiIconPurple}><IconFileLegal /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValue}>{stats.totalSales > 0 ? stats.totalSales : 12} Unit</span>
            <span className={styles.purpleChip}>Rp 9,8 M</span>
          </div>
          <div className={styles.kpiSubText}>Target closing: 14 unit</div>
        </div>

        {/* Card 5: Konversi Closing Q1 */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTopRow}>
            <span className={styles.kpiLabel}>KONVERSI CLOSING Q1</span>
            <div className={styles.kpiIconAmber}><IconArrowUpRight /></div>
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiMainValue}>14.8%</span>
            <span className={styles.trendBadgePositive}>↑ +2.1%</span>
          </div>
          <div className={styles.kpiSubText}>Melampaui Target (12.0%)</div>
        </div>
      </div>

      {/* 2. TAB CONTENT: EXECUTIVE COCKPIT (Default) */}
      {activeTab === 'cockpit' && (
        <div className={styles.cockpitWorkspace}>
          {/* LEFT COLUMN: Pipeline Stage Monitor & Activity Log */}
          <div className={styles.leftColumn}>
            {/* Pipeline Stage Monitor Card */}
            <div className={styles.cockpitCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitleWithIcon}>
                    <span className={styles.amberIcon}><IconCockpit /></span>
                    <h2 className={styles.cardTitle}>Pipeline Stage Monitor Prospek</h2>
                  </div>
                  <p className={styles.cardSubtitle}>
                    Monitor status real-time calon pembeli dari kunjungan hingga akad kredit notaris.
                  </p>
                </div>
                <div className={styles.cardHeaderActions}>
                  <select className={styles.filterSelect}>
                    <option>Semua PIC Sales</option>
                    <option>Ayu Lestari</option>
                    <option>Reza Firmansyah</option>
                  </select>
                  <button type="button" className={styles.filterBtn}>
                    <IconFilter />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Stage Filter Tabs */}
              <div className={styles.stageTabs}>
                <button 
                  type="button" 
                  onClick={() => setActiveStage('inquiry')}
                  className={`${styles.stageTab} ${activeStage === 'inquiry' ? styles.stageTabActive : ''}`}
                >
                  <span>Inquiry Baru</span>
                  <span className={styles.stageCountRed}>42</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveStage('konsultasi')}
                  className={`${styles.stageTab} ${activeStage === 'konsultasi' ? styles.stageTabActive : ''}`}
                >
                  <span>Konsultasi WA</span>
                  <span className={styles.stageCountMuted}>56</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveStage('survey')}
                  className={`${styles.stageTab} ${activeStage === 'survey' ? styles.stageTabActive : ''}`}
                >
                  <span>Survey Lokasi</span>
                  <span className={styles.stageCountMuted}>28</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveStage('slik')}
                  className={`${styles.stageTab} ${activeStage === 'slik' ? styles.stageTabActive : ''}`}
                >
                  <span>BI Checking SLIK</span>
                  <span className={styles.stageCountMuted}>15</span>
                </button>
              </div>

              {/* Prospect Lead Cards List */}
              <div className={styles.leadsList}>
                {/* Lead Item 1 */}
                <div className={styles.leadCard}>
                  <div className={styles.leadMain}>
                    <div className={`${styles.leadAvatar} ${styles.avatarPink}`}>AL</div>
                    <div className={styles.leadDetails}>
                      <div className={styles.leadTopRow}>
                        <div className={styles.leadNameGroup}>
                          <h3 className={styles.leadName}>Dr. Amanda Larasati</h3>
                          <span className={styles.badgeUrgent}>Urgent Inquiry</span>
                        </div>
                        <div className={styles.leadScoreGroup}>
                          <span className={styles.scoreText}>Skor Minat: <strong>96/100</strong></span>
                          <span className={styles.leadSource}>Web Form • 15 mnt lalu</span>
                        </div>
                      </div>

                      <div className={styles.leadMetaRow}>
                        <span className={styles.leadId}>#LD-8819</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.leadUnit}>Harmoni Signature Villa (Blok A-01)</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.leadPrice}>Rp 1,85 Miliar (Cash Bertahap 12x)</span>
                      </div>

                      {/* Quote Box */}
                      <div className={styles.quoteBox}>
                        <p className={styles.quoteText}>
                          &quot;Minta layout denah hook &amp; ketentuan pelunasan termin 1.&quot;
                        </p>
                        <span className={styles.picMuted}>PIC: Belum Ditugaskan</span>
                      </div>

                      {/* Lead Actions */}
                      <div className={styles.leadActionRow}>
                        <div className={styles.slaCounter}>
                          <IconClock />
                          <span>SLA Sisa: <strong>28 menit</strong></span>
                        </div>
                        <div className={styles.actionButtonsGroup}>
                          <button type="button" className={styles.btnSecondary}>
                            + Tugaskan Sales
                          </button>
                          <a 
                            href="https://wa.me/6281234567890?text=Halo%20Dr.%20Amanda%2C%20kami%20dari%20Derinos%20Group%20..." 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.btnWhatsApp}
                          >
                            <IconWhatsApp />
                            <span>Hubungi WA Sekarang</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Item 2 */}
                <div className={styles.leadCard}>
                  <div className={styles.leadMain}>
                    <div className={`${styles.leadAvatar} ${styles.avatarAmber}`}>RW</div>
                    <div className={styles.leadDetails}>
                      <div className={styles.leadTopRow}>
                        <div className={styles.leadNameGroup}>
                          <h3 className={styles.leadName}>Raden Surya Wicaksono</h3>
                          <span className={styles.badgeHot}>Hot Lead (Konsultasi)</span>
                        </div>
                        <div className={styles.leadScoreGroup}>
                          <span className={styles.scoreText}>Skor Minat: <strong>94/100</strong></span>
                          <span className={styles.leadSource}>WhatsApp • 40 mnt lalu</span>
                        </div>
                      </div>

                      <div className={styles.leadMetaRow}>
                        <span className={styles.leadId}>#LD-8821</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.leadUnit}>Taman Harmoni Tipe 36/72 (Blok A-08)</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.leadPrice}>Rp 650 Juta (KPR BTN DP 10%)</span>
                      </div>

                      <div className={styles.quoteBox}>
                        <p className={styles.quoteText}>
                          Kolektibilitas SLIK OJK Lancar (Kol-1). Menginginkan opsi DP dicicil 3x.
                        </p>
                        <span className={styles.picActive}>PIC: Ayu Lestari</span>
                      </div>

                      <div className={styles.leadActionRow}>
                        <div className={styles.chipsRow}>
                          <span className={styles.statusChipGreen}>✓ Brosur Terkirim</span>
                          <span className={styles.statusChipSlate}>Cicilan Rp 4,2 Jt/bln</span>
                        </div>
                        <div className={styles.actionButtonsGroup}>
                          <button type="button" className={styles.btnSecondary}>
                            Jadwalkan Survey
                          </button>
                          <a 
                            href="https://wa.me/6281234567891" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.btnWhatsApp}
                          >
                            <IconWhatsApp />
                            <span>Chat WA Ayu</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Item 3 */}
                <div className={styles.leadCard}>
                  <div className={styles.leadMain}>
                    <div className={`${styles.leadAvatar} ${styles.avatarGreen}`}>BT</div>
                    <div className={styles.leadDetails}>
                      <div className={styles.leadTopRow}>
                        <div className={styles.leadNameGroup}>
                          <h3 className={styles.leadName}>Bambang Trihatmojo</h3>
                          <span className={styles.badgeSuccess}>BI Check OK (Kolektibilitas 1)</span>
                        </div>
                        <div className={styles.leadScoreGroup}>
                          <span className={styles.scoreText}>Skor Minat: <strong>98/100</strong></span>
                          <span className={styles.leadSource}>Survey Selesai • Kemarin</span>
                        </div>
                      </div>

                      <div className={styles.leadMetaRow}>
                        <span className={styles.leadId}>#LD-8794</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.leadUnit}>Grand Harmoni Blok B-14</span>
                        <span className={styles.metaDot}>•</span>
                        <span className={styles.leadPrice}>Rp 980 Juta (KPR Mandiri Prioritas)</span>
                      </div>

                      <div className={styles.statusNoticeBox}>
                        <span>Status Unit: <strong>Kavling B-14 Hold NUP 24 Jam</strong></span>
                        <span className={styles.metaDot}>|</span>
                        <span>PIC Sales Agent: <strong>Reza Firmansyah</strong></span>
                      </div>

                      <div className={styles.leadActionRow}>
                        <div className={styles.pendingUTJ}>
                          <span>Menunggu Konfirmasi Bukti Transfer UTJ Rp 5 Jt</span>
                        </div>
                        <div className={styles.actionButtonsGroup}>
                          <button type="button" className={styles.btnAmberAction}>
                            Cetak SPR &amp; UTJ
                          </button>
                          <button type="button" className={styles.btnEmeraldAction}>
                            Kirim Rekening Developer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Log Aktivitas Sales Agent */}
            <div className={styles.cockpitCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleWithIcon}>
                  <span className={styles.slateIcon}><IconClock /></span>
                  <h2 className={styles.cardTitle}>Log Aktivitas &amp; Interaksi Sales Agent</h2>
                </div>
                <span className={styles.realtimePill}>Real-time Feed</span>
              </div>

              <div className={styles.activityFeed}>
                <div className={styles.feedItem}>
                  <div className={styles.feedIconGreen}>
                    <PhoneIcon size={14} color="#10B981" />
                  </div>
                  <div className={styles.feedContent}>
                    <div className={styles.feedHeader}>
                      <strong className={styles.feedAgent}>Ayu Lestari (Sales Agent)</strong>
                      <span className={styles.feedTime}>8 mnt lalu</span>
                    </div>
                    <p className={styles.feedDesc}>
                      Selesai panggilan WhatsApp follow-up ke <strong>Raden Surya Wicaksono</strong>. Prospek konfirmasi hadir survey besok pukul 10:00 WIB.
                    </p>
                  </div>
                </div>

                <div className={styles.feedItem}>
                  <div className={styles.feedIconAmber}>
                    <IconFileLegal />
                  </div>
                  <div className={styles.feedContent}>
                    <div className={styles.feedHeader}>
                      <strong className={styles.feedAgent}>Raden Ayu (Lead Admin)</strong>
                      <span className={styles.feedTime}>24 mnt lalu</span>
                    </div>
                    <p className={styles.feedDesc}>
                      Memverifikasi kelengkapan berkas KPR BTN <strong>Maya Indriani (Blok C-08)</strong>. Menunggu slip gaji legalisir.
                    </p>
                  </div>
                </div>

                <div className={styles.feedItem}>
                  <div className={styles.feedIconBlue}>
                    <IconUnits />
                  </div>
                  <div className={styles.feedContent}>
                    <div className={styles.feedHeader}>
                      <strong className={styles.feedAgent}>Reza Firmansyah (Sales)</strong>
                      <span className={styles.feedTime}>1 jam lalu</span>
                    </div>
                    <p className={styles.feedDesc}>
                      Membuat form NUP booking sementara unit <strong>Bambang Trihatmojo (Blok B-14)</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.feedFooter}>
                <span>Menampilkan 3 aktivitas terbaru dari 64 total log.</span>
                <Link href="/admin/leads" className={styles.feedLink}>
                  Lihat Semua Log →
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Site Plan Matrix & WhatsApp Broadcast Automation */}
          <div className={styles.rightColumn}>
            {/* Site Plan & Unit Matrix Monitor Card */}
            <div className={styles.cockpitCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitleWithIcon}>
                    <span className={styles.amberIcon}><IconUnits /></span>
                    <h2 className={styles.cardTitle}>Site Plan &amp; Unit Matrix Monitor</h2>
                  </div>
                  <p className={styles.cardSubtitle}>
                    Monitoring kavling aktif Cluster Alam Asri secara visual.
                  </p>
                </div>
                <span className={styles.totalUnitsBadge}>Total: 48 Unit</span>
              </div>

              {/* Matrix Blueprint Visual Box */}
              <div className={styles.matrixContainer}>
                <div className={styles.matrixHeaderRow}>
                  <span className={styles.matrixBoulevard}>● Blok Boulevard &amp; Asri Timur</span>
                  <span className={styles.matrixCode}>SITEPLAN_ACTIVE_V4</span>
                </div>

                {/* Grid of Unit Matrix Boxes */}
                <div className={styles.unitMatrixGrid}>
                  <div 
                    onClick={() => setActiveUnitMatrix('A-08')}
                    className={`${styles.unitCell} ${styles.cellReady} ${activeUnitMatrix === 'A-08' ? styles.cellSelected : ''}`}
                  >
                    <div className={styles.unitCode}>A - 08</div>
                    <div className={styles.unitStatusText}>READY</div>
                    <div className={styles.unitSub}>Bougenville</div>
                  </div>

                  <div 
                    onClick={() => setActiveUnitMatrix('A-09')}
                    className={`${styles.unitCell} ${styles.cellHold} ${activeUnitMatrix === 'A-09' ? styles.cellSelected : ''}`}
                  >
                    <div className={styles.unitCode}>A - 09</div>
                    <div className={styles.unitStatusText}>HOLD UTJ</div>
                    <div className={styles.unitSub}>04:22:10</div>
                  </div>

                  <div 
                    onClick={() => setActiveUnitMatrix('B-03')}
                    className={`${styles.unitCell} ${styles.cellBangun} ${activeUnitMatrix === 'B-03' ? styles.cellSelected : ''}`}
                  >
                    <div className={styles.unitCode}>B - 03</div>
                    <div className={styles.unitStatusText}>BANGUN</div>
                    <div className={styles.unitSub}>65% • Type 45</div>
                  </div>

                  <div className={`${styles.unitCell} ${styles.cellTerjual}`}>
                    <div className={styles.unitCode}>B - 04</div>
                    <div className={styles.unitStatusText}>TERJUAL</div>
                    <div className={styles.unitSub}>Akad BTN</div>
                  </div>

                  <div className={`${styles.unitCell} ${styles.cellTerjual}`}>
                    <div className={styles.unitCode}>B - 05</div>
                    <div className={styles.unitStatusText}>TERJUAL</div>
                    <div className={styles.unitSub}>Akad BCA</div>
                  </div>

                  <div 
                    onClick={() => setActiveUnitMatrix('B-06')}
                    className={`${styles.unitCell} ${styles.cellReady} ${activeUnitMatrix === 'B-06' ? styles.cellSelected : ''}`}
                  >
                    <div className={styles.unitCode}>B - 06</div>
                    <div className={styles.unitStatusText}>READY</div>
                    <div className={styles.unitSub}>Type 54</div>
                  </div>

                  <div 
                    onClick={() => setActiveUnitMatrix('C-01')}
                    className={`${styles.unitCell} ${styles.cellHold} ${activeUnitMatrix === 'C-01' ? styles.cellSelected : ''}`}
                  >
                    <div className={styles.unitCode}>C - 01</div>
                    <div className={styles.unitStatusText}>HOLD SP3K</div>
                    <div className={styles.unitSub}>18:45:00</div>
                  </div>

                  <div 
                    onClick={() => setActiveUnitMatrix('C-02')}
                    className={`${styles.unitCell} ${styles.cellBangun} ${activeUnitMatrix === 'C-02' ? styles.cellSelected : ''}`}
                  >
                    <div className={styles.unitCode}>C - 02</div>
                    <div className={styles.unitStatusText}>BANGUN</div>
                    <div className={styles.unitSub}>80% • Type 72</div>
                  </div>
                </div>

                {/* Matrix Legend */}
                <div className={styles.matrixLegend}>
                  <span className={styles.legendItem}><span className={styles.dotGreen} /> Ready (24)</span>
                  <span className={styles.legendItem}><span className={styles.dotAmber} /> Hold / Booking (6)</span>
                  <span className={styles.legendItem}><span className={styles.dotBlue} /> Bangun (8)</span>
                  <span className={styles.legendItem}><span className={styles.dotSlate} /> Terjual (82)</span>
                </div>
              </div>

              {/* Active Unit Detail Quick Info */}
              <div className={styles.activeUnitSection}>
                <h4 className={styles.sectionHeader}>INFORMASI DETAIL KAVLING AKTIF</h4>
                
                {/* Unit Details Display */}
                <div className={styles.unitDetailCard}>
                  <div className={styles.unitDetailHeader}>
                    <span className={styles.unitBadgeCode}>A-08</span>
                    <strong className={styles.unitNameTitle}>Bougenville Asri Tipe 36/72</strong>
                    <span className={styles.badgeReadyStock}>READY STOCK</span>
                  </div>

                  <div className={styles.specsGrid}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Status Legalitas:</span>
                      <strong className={styles.specValueGreen}>✓ SHM Pecah</strong>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Harga Pricelist:</span>
                      <strong className={styles.specValuePrice}>Rp 650.000.000</strong>
                    </div>
                    <div className={styles.specItemFull}>
                      <span className={styles.specLabel}>Mitra KPR Rekomendasi:</span>
                      <strong className={styles.specValueBlue}>Bank BTN (Bunga 3.75%)</strong>
                    </div>
                  </div>
                </div>

                {/* Concierge Bar */}
                <div className={styles.conciergeBar}>
                  <div className={styles.conciergeLeft}>
                    <span className={styles.conciergeDot} />
                    <span>Derinos Concierge Desk Live</span>
                  </div>
                  <span className={styles.conciergeRight}>Fast Response Support</span>
                </div>

                {/* Mitra Bank KPR */}
                <div className={styles.bankPksRow}>
                  <span className={styles.bankPksLabel}>Mitra Bank KPR PKS Resmi:</span>
                  <div className={styles.bankTags}>
                    <span className={styles.bankTag}>BTN Syariah</span>
                    <span className={styles.bankTag}>Bank Mandiri</span>
                    <span className={styles.bankTag}>BCA Prioritas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Broadcast Action Center & Automasi Card */}
            <div className={styles.whatsappCard}>
              <div className={styles.waCardHeader}>
                <div className={styles.waIconBox}>
                  <IconWhatsApp />
                </div>
                <div className={styles.waHeaderText}>
                  <h3 className={styles.waTitle}>WhatsApp Broadcast Action Center &amp; Automasi</h3>
                  <p className={styles.waSubtitle}>
                    Broadcast terarah otomatis via Official WhatsApp Business API Meta.
                  </p>
                </div>
                <div className={styles.waStatusBadge}>
                  <span className={styles.waDot} />
                  <span>WA API Connected</span>
                </div>
              </div>

              {/* Template 1 */}
              <div className={styles.templateCard}>
                <div className={styles.templateHeader}>
                  <span className={styles.templateBadge}>TEMPLATE TERVERIFIKASI META</span>
                  <span className={styles.templateSent}>Terkirim 88/88</span>
                </div>
                <h4 className={styles.templateTitle}>Promo KPR Subsidi Bunga 2.75% Fixed 3 Thn</h4>
                <p className={styles.templateSnippet}>
                  &quot;Dapatkan subsidi bunga spesial bank BTN &amp; Mandiri khusus booking kavling minggu ini...&quot;
                </p>
                <div className={styles.templateActionRow}>
                  <span className={styles.templateTarget}>Target: <strong>42 Leads Inquiry</strong></span>
                  <button type="button" className={styles.btnBroadcastAmber}>
                    <IconWhatsApp />
                    <span>Kirim Broadcast</span>
                  </button>
                </div>
              </div>

              {/* Template 2 */}
              <div className={styles.templateCard}>
                <div className={styles.templateHeader}>
                  <span className={styles.templateBadgeBlue}>JADWAL OTOMATIS BESOK</span>
                  <span className={styles.templateSent}>Siap Kirim</span>
                </div>
                <h4 className={styles.templateTitle}>Reminder Site Plan Visit &amp; Konsultasi KPR</h4>
                <p className={styles.templateSnippet}>
                  &quot;Undangan eksklusif survey unit contoh Cluster Alam Asri &amp; coffee morning bersama tim arsitek...&quot;
                </p>
                <div className={styles.templateActionRow}>
                  <span className={styles.templateTarget}>Target: <strong>28 Leads Survey</strong></span>
                  <button type="button" className={styles.btnAutoSend}>
                    <span>Aktifkan Auto-Send</span>
                  </button>
                </div>
              </div>

              {/* Quota Bar */}
              <div className={styles.quotaSection}>
                <div className={styles.quotaTextRow}>
                  <span>Quota Bulanan: <strong>6.420 / 10.000</strong> Pesan WA Tersedia</span>
                </div>
                <div className={styles.quotaBar}>
                  <div className={styles.quotaFill} style={{ width: '64.2%' }} />
                </div>
              </div>

              {/* WhatsApp Action Buttons */}
              <div className={styles.waFooterActions}>
                <button type="button" className={styles.btnWaSecondary}>
                  Kelola Template Pesan
                </button>
                <button type="button" className={styles.btnWaPrimary}>
                  + Buat Kampanye Pesan Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: ANALYTICS & REPORTS (Original Charts & Bookings Table) */}
      {activeTab === 'analytics' && (
        <div className={styles.analyticsWorkspace}>
          {/* CHARTS GRID */}
          <div className={styles.mainGrid}>
            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Sales Revenue Trend (Last 6 Months)</h2>
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12 }} 
                      tickFormatter={(val) => `Rp${(val / 1000000000).toFixed(0)}B`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#F59E0B" 
                      strokeWidth={3.5} 
                      dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 6, fill: '#0B192C', stroke: '#F59E0B', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Unit Status Overview</h2>
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={unitStatusData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} width={120} />
                    <RechartsTooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                      {unitStatusData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.colorHex || '#F59E0B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* LISTS GRID */}
          <div className={styles.bottomGrid}>
            <div className={styles.listCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Recent Bookings &amp; Transaksi</h2>
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
                      recentBookings.map((b: any) => (
                        <tr key={b.id}>
                          <td className={styles.fw500}>{b.customer?.name || 'Unknown'}</td>
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
                <h2 className={styles.cardTitle}>Customer Baru</h2>
                <Link href="/admin/customers" className={styles.viewAll}>Semua Customer →</Link>
              </div>
              <div className={styles.activityList}>
                {recentCustomers.length === 0 ? (
                  <div className={styles.emptyText}>Belum ada customer terdaftar.</div>
                ) : (
                  recentCustomers.map((c: any) => (
                    <div key={c.id} className={styles.activityItem}>
                      <div className={styles.avatarCircle}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityTitle}>{c.name}</div>
                        <div className={styles.activityDesc}>{c.phone || c.email || 'No contact provided'}</div>
                      </div>
                      <div className={styles.activityTime}>
                        {new Date(c.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
