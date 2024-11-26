import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.window}>
          <div className={styles.windowHeader}>
            <h1>M-Chama</h1>
            <h2>Revolutionizing Group Savings in Kenya</h2>
          </div>
          
          <div className={styles.content}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Secure Savings</h3>
                <p className={styles.statValue}>Digital Solutions</p>
              </div>
              <div className={styles.statCard}>
                <h3>Easy Management</h3>
                <p className={styles.statValue}>Track Progress</p>
              </div>
              <div className={styles.statCard}>
                <h3>Group Growth</h3>
                <p className={styles.statValue}>Better Together</p>
              </div>
            </div>

            <div className={styles.welcomeSection}>
              <p>Welcome to the future of Chama management. Save, track, and grow your group funds securely with modern digital solutions.</p>
            </div>

            <div className={styles.actionButtons}>
              <Link href="/login">
                <button className={styles.actionButton}>Login</button>
              </Link>
              <Link href="/register">
                <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
