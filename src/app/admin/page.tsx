import React from 'react';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import styles from './page.module.css';

const IconTrendUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconLead = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

const IconBooking = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default async function AdminDashboardPage() {
  const session = await verifySession();
  const user = session ? await AuthService.getUserById(session.userId) : null;

  if (!user) return null;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Overview</h1>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total Projects</div>
          <div className={styles.kpiValue}>12</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Active Construction</div>
          <div className={styles.kpiValue}>5</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total Units</div>
          <div className={styles.kpiValueWrapper}>
            <span className={styles.kpiValue}>1,450</span>
            <span className={styles.kpiSub}>(82% Sold)</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '82%' }}></div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Monthly Sales</div>
          <div className={styles.kpiValue}>$4.2M</div>
          <div className={styles.kpiTrend}>
            <IconTrendUp /> +12%
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Sales Performance</h2>
            <select className={styles.dateSelect}>
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className={styles.chartMockup}>
            {/* Simple SVG Line Chart Mock */}
            <svg viewBox="0 0 500 200" className={styles.svgChart}>
              <path d="M 20 180 L 100 150 L 180 160 L 260 100 L 340 130 L 420 60" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              <circle cx="20" cy="180" r="4" fill="var(--color-primary)" />
              <circle cx="100" cy="150" r="4" fill="var(--color-primary)" />
              <circle cx="180" cy="160" r="4" fill="var(--color-primary)" />
              <circle cx="260" cy="100" r="4" fill="var(--color-primary)" />
              <circle cx="340" cy="130" r="4" fill="var(--color-primary)" />
              <circle cx="420" cy="60" r="4" fill="var(--color-primary)" />
              
              <line x1="20" y1="180" x2="20" y2="200" stroke="#E5E7EB" />
              <line x1="100" y1="150" x2="100" y2="200" stroke="#E5E7EB" />
              <line x1="180" y1="160" x2="180" y2="200" stroke="#E5E7EB" />
              <line x1="260" y1="100" x2="260" y2="200" stroke="#E5E7EB" />
              <line x1="340" y1="130" x2="340" y2="200" stroke="#E5E7EB" />
              <line x1="420" y1="60" x2="420" y2="200" stroke="#E5E7EB" />
            </svg>
            <div className={styles.chartLabels}>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        <div className={styles.donutCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Unit Availability</h2>
          </div>
          <div className={styles.donutMockup}>
            <div className={styles.donutCircle}>
              <div className={styles.donutInner}>
                <span className={styles.donutValue}>1,450</span>
                <span className={styles.donutLabel}>Total</span>
              </div>
            </div>
          </div>
          <div className={styles.donutLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendLabel}>
                <span className={styles.legendDot} style={{ background: 'var(--color-primary)' }}></span>
                Sold
              </div>
              <div className={styles.legendStats}>
                <strong>1,189</strong> (82%)
              </div>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendLabel}>
                <span className={styles.legendDot} style={{ background: 'var(--color-secondary)' }}></span>
                Reserved
              </div>
              <div className={styles.legendStats}>
                <strong>116</strong> (8%)
              </div>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendLabel}>
                <span className={styles.legendDot} style={{ background: '#E5E7EB' }}></span>
                Available
              </div>
              <div className={styles.legendStats}>
                <strong>145</strong> (10%)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <a href="#" className={styles.viewAll}>View All</a>
          </div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>
                <IconLead />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>New Lead: <strong>Sarah Jenkins</strong></div>
                <div className={styles.activityDesc}>Inquired about Greenwood Residence</div>
              </div>
              <div className={styles.activityTime}>2h ago</div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon} style={{ background: '#FFFBEB', color: '#F59E0B' }}>
                <IconBooking />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>Booking Confirmed: <strong>Unit 4B</strong></div>
                <div className={styles.activityDesc}>The Valley Estate</div>
              </div>
              <div className={styles.activityTime}>5h ago</div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>
                <IconLead />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>New Lead: <strong>Michael Chen</strong></div>
                <div className={styles.activityDesc}>Inquired about Grand Arunika</div>
              </div>
              <div className={styles.activityTime}>1d ago</div>
            </div>
          </div>
        </div>

        <div className={styles.progressCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Project Progress</h2>
          </div>
          <div className={styles.progressList}>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Greenwood Residence</span>
                <strong>65%</strong>
              </div>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressFill} style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>Grand Arunika</span>
                <strong>40%</strong>
              </div>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressFill} style={{ width: '40%', background: 'var(--color-secondary)' }}></div>
              </div>
            </div>
            <div className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span>The Valley Estate</span>
                <strong>90%</strong>
              </div>
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressFill} style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
