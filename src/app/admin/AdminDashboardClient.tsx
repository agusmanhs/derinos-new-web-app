'use client';

import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import styles from './AdminDashboardClient.module.css';

export function AdminDashboardClient({ 
  stats, 
  recentBookings, 
  recentCustomers, 
  chartData,
  unitStatusData
}: any) {
  
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}M`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  const totalUnitsValue = unitStatusData.reduce((acc: number, item: any) => acc + item.value, 0);
  const soldUnitsValue = unitStatusData.find((u: any) => u.name.toLowerCase().includes('sold') || u.name.toLowerCase().includes('terjual') || u.name.toLowerCase().includes('book'))?.value || 0;
  const soldPercentage = totalUnitsValue > 0 ? Math.round((soldUnitsValue / totalUnitsValue) * 100) : 0;

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSubtitle}>Monitor key metrics and recent activities</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#ecfdf5', color: '#064E3B' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Total Projects</div>
            <div className={styles.kpiValue}>{stats.totalProjects}</div>
          </div>
        </div>
        
        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#fef3c7', color: '#C5A059' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Total Units</div>
            <div className={styles.kpiValueWrapper}>
              <span className={styles.kpiValue}>{totalUnitsValue}</span>
              <span className={styles.kpiSub}>({soldPercentage}% Booked)</span>
            </div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>New Customers</div>
            <div className={styles.kpiValue}>{stats.totalCustomers}</div>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiIconWrapper} style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiLabel}>Booked Value</div>
            <div className={styles.kpiValue}>{formatCurrency(stats.totalRevenue)}</div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className={styles.mainGrid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Sales Revenue Trend (Last 6 Months)</h2>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  tickFormatter={(val) => `Rp${(val / 1000000000).toFixed(0)}B`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--color-secondary)" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: 'var(--color-secondary)', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'none' }}
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
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }} width={120} />
                <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {unitStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.colorHex || 'var(--color-primary)'} />
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
            <h2 className={styles.cardTitle}>Recent Bookings</h2>
            <a href="/admin/bookings" className={styles.viewAll}>View All</a>
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
                  <tr><td colSpan={4} className={styles.emptyText}>No recent bookings found.</td></tr>
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
            <h2 className={styles.cardTitle}>New Customers</h2>
            <a href="/admin/customers" className={styles.viewAll}>View All</a>
          </div>
          <div className={styles.activityList}>
            {recentCustomers.length === 0 ? (
              <div className={styles.emptyText}>No recent customers.</div>
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
  );
}
