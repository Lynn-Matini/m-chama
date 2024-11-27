import styles from './dashboard-layout.module.css';

export const metadata = {
  title: 'Dashboard - M-Chama',
  description: 'M-Chama Dashboard',
};

export default async function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      {children}
    </div>
  );
}