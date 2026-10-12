'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader/AdminPageHeader';
import { AdminTable } from '@/components/admin/AdminTable/AdminTable';
import { Sale } from '@/types/sale';
import { updateSaleStatusAction } from '@/actions/adminSalesActions';
import styles from './SalesListClient.module.css';

interface Props {
  sales: Sale[];
}

export const SalesListClient: React.FC<Props> = ({ sales }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Local optimistic state
  const [items, setItems] = useState<Sale[]>(sales);

  React.useEffect(() => {
    setItems(sales);
  }, [sales]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle status update
  const handleStatusChange = (id: string, newStatus: Sale['status']) => {
    setItems(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

    startTransition(async () => {
      try {
        await updateSaleStatusAction(id, newStatus);
        router.refresh();
      } catch (err: any) {
        console.error('Failed to update deal status:', err);
        alert('Gagal mengubah status deal: ' + (err?.message || 'Terjadi kesalahan'));
        router.refresh();
      }
    });
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const activeSales = items.filter(s => s.status !== 'Cancelled');
    const totalDeals = items.length;
    const totalRevenue = activeSales.reduce((acc, s) => acc + s.contractPrice, 0);

    const kprSales = activeSales.filter(s => s.paymentMethod === 'Mortgage');
    const kprCount = kprSales.length;
    const kprRevenue = kprSales.reduce((acc, s) => acc + s.contractPrice, 0);

    const cashSales = activeSales.filter(s => s.paymentMethod === 'Cash' || s.paymentMethod === 'Installment');
    const cashCount = cashSales.length;
    const cashRevenue = cashSales.reduce((acc, s) => acc + s.contractPrice, 0);

    return {
      totalDeals,
      totalRevenue,
      kprCount,
      kprRevenue,
      cashCount,
      cashRevenue
    };
  }, [items]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    let result = items;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.customer?.name?.toLowerCase().includes(lower) ||
        s.unitNumber?.toLowerCase().includes(lower) ||
        s.projectTitle?.toLowerCase().includes(lower) ||
        s.agency?.name?.toLowerCase().includes(lower) ||
        s.notes?.toLowerCase().includes(lower)
      );
    }

    if (methodFilter) {
      result = result.filter(s => s.paymentMethod === methodFilter);
    }

    if (statusFilter) {
      result = result.filter(s => s.status === statusFilter);
    }

    return result;
  }, [items, searchTerm, methodFilter, statusFilter]);

  // Paginated sales
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(start, start + itemsPerPage);
  }, [filteredSales, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, methodFilter, statusFilter]);

  const columns = [
    {
      header: 'Customer & Agency',
      accessor: (row: Sale) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>
            {row.customer?.name || row.customerId}
          </strong>
          {row.agency?.name && (
            <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 500 }}>
              🏢 {row.agency.name}
            </span>
          )}
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {new Date(row.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      )
    },
    {
      header: 'Property Unit',
      accessor: (row: Sale) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <strong style={{ fontSize: '0.95rem', color: '#2563eb' }}>
            Unit {row.unitNumber.toUpperCase()}
          </strong>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {row.projectTitle}
          </span>
          {row.notes && (
            <div style={{
              marginTop: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.75rem',
              color: '#334155',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '4px',
              maxWidth: '280px'
            }}>
              <span>📝</span>
              <span style={{ fontStyle: 'italic' }}>&ldquo;{row.notes}&rdquo;</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Nilai Kontrak / Omset',
      accessor: (row: Sale) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '0.95rem', color: '#059669' }}>
            Rp {row.contractPrice.toLocaleString('id-ID')}
          </strong>
        </div>
      )
    },
    {
      header: 'Skema Pembayaran',
      accessor: (row: Sale) => {
        const isMortgage = row.paymentMethod === 'Mortgage';
        const isCash = row.paymentMethod === 'Cash';
        const label = isMortgage ? '🏦 KPR' : isCash ? '💵 Cash Keras' : '🗓️ Cash Bertahap';
        const bg = isMortgage ? '#eff6ff' : isCash ? '#ecfdf5' : '#fffbeb';
        const border = isMortgage ? '#bfdbfe' : isCash ? '#a7f3d0' : '#fde68a';
        const text = isMortgage ? '#1e40af' : isCash ? '#065f46' : '#92400e';

        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: bg,
            border: `1px solid ${border}`,
            color: text
          }}>
            {label}
          </span>
        );
      }
    },
    {
      header: 'Status Deal',
      accessor: (row: Sale) => {
        let badgeColor = '#fef3c7';
        let textColor = '#92400e';
        if (row.status === 'Completed') {
          badgeColor = '#d1fae5';
          textColor = '#065f46';
        } else if (row.status === 'Cancelled') {
          badgeColor = '#fee2e2';
          textColor = '#991b1b';
        }

        return (
          <select 
            value={row.status} 
            onChange={(e) => handleStatusChange(row.id, e.target.value as Sale['status'])}
            disabled={isPending}
            className={styles.statusSelect}
            style={{ backgroundColor: badgeColor, color: textColor }}
          >
            <option value="In Progress">In Progress (Berjalan)</option>
            <option value="Completed">Completed (Selesai)</option>
            <option value="Cancelled">Cancelled (Dibatalkan)</option>
          </select>
        );
      }
    }
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader 
        title="Sales Deals & Transaksi" 
        description="Pantau penutupan transaksi (closing), omset kontrak penjualan, dan skema pembiayaan konsumen."
      />

      {/* Summary Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#2563eb' }}>
            <span>💼</span>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Sales Deals</span>
            <span className={styles.metricValue}>{metrics.totalDeals} Transaksi</span>
            <span className={styles.metricSubtext}>Semua transaksi tercatat</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
            <span>💰</span>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Omset Kontrak</span>
            <span className={styles.metricValue} style={{ color: '#059669' }}>
              Rp {metrics.totalRevenue.toLocaleString('id-ID')}
            </span>
            <span className={styles.metricSubtext}>Nilai deal aktif / closing</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <span>🏦</span>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>KPR (Mortgage)</span>
            <span className={styles.metricValue}>{metrics.kprCount} Unit</span>
            <span className={styles.metricSubtext}>
              Rp {metrics.kprRevenue.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#fffbeb', color: '#d97706' }}>
            <span>💵</span>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Cash / Bertahap</span>
            <span className={styles.metricValue}>{metrics.cashCount} Unit</span>
            <span className={styles.metricSubtext}>
              Rp {metrics.cashRevenue.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className={styles.filtersCard}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label>Pencarian</label>
            <input 
              type="text" 
              placeholder="Cari customer, unit, perumahan, agency..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Skema Pembayaran</label>
            <select 
              value={methodFilter} 
              onChange={(e) => setMethodFilter(e.target.value)} 
              className={styles.filterSelect}
            >
              <option value="">Semua Skema</option>
              <option value="Mortgage">🏦 KPR (Mortgage)</option>
              <option value="Cash">💵 Cash Keras</option>
              <option value="Installment">🗓️ Cash Bertahap</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Status Transaksi</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className={styles.filterSelect}
            >
              <option value="">Semua Status</option>
              <option value="In Progress">In Progress (Sedang Berjalan)</option>
              <option value="Completed">Completed (Selesai Akad / Lunas)</option>
              <option value="Cancelled">Cancelled (Dibatalkan)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className={styles.tableCard}>
        <AdminTable 
          columns={columns} 
          data={paginatedSales} 
          keyExtractor={(row) => row.id} 
          emptyMessage="Belum ada transaksi Sales Deals. Anda dapat membuat deal melalui Site Plan atau halaman Bookings."
        />

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageButton} 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Halaman {currentPage} dari {totalPages}
            </span>
            <button 
              className={styles.pageButton} 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
