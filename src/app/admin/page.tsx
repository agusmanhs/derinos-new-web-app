import React from 'react';
import { verifySession } from '@/lib/session';
import { AuthService } from '@/services/authService';
import styles from './page.module.css';

export default async function AdminDashboardPage() {
  const session = await verifySession();
  const user = session ? await AuthService.getUserById(session.userId) : null;

  if (!user) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeBanner}>
        <h1>Welcome back, {user.name}</h1>
        <p>Here is what is happening across your properties today.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Leads</h3>
          <div className={styles.statValue}>142</div>
          <span className={styles.statTrend}>+12% this week</span>
        </div>
        <div className={styles.statCard}>
          <h3>Active Projects</h3>
          <div className={styles.statValue}>3</div>
        </div>
        <div className={styles.statCard}>
          <h3>Available Units</h3>
          <div className={styles.statValue}>84</div>
        </div>
      </div>

      <div className={styles.infoCard}>
        <h2>Your Permissions</h2>
        <p>You are logged in as <strong>{user.role}</strong>.</p>
        <p className={styles.helpText}>
          Based on your role, the sidebar on the left will only display the modules you have permission to access.
        </p>
      </div>
    </div>
  );
}
