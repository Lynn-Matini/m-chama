'use client';

import styles from '../page.module.css';
import DashboardClient from './dashboard-client';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <DashboardClient />
    </div>
  );
}