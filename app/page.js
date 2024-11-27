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
            <div className={styles.featureCard}>
              <div className={styles.featureItem}>
                <h3>Secure Savings</h3>
                <p>Digital Solutions</p>
              </div>
              <div className={styles.divider} />
              <div className={styles.featureItem}>
                <h3>Easy Management</h3>
                <p>Track Progress</p>
              </div>
              <div className={styles.divider} />
              <div className={styles.featureItem}>
                <h3>Group Growth</h3>
                <p>Better Together</p>
              </div>
            </div>

            <div className={styles.welcomeSection}>
              <p>Welcome to the future of Chama management. Save, track, and grow your group funds securely with modern digital solutions.</p>
            </div>

            <div className={styles.buttonGroup}>
              <Link href="/login" className={styles.submitButton}>
                Login
              </Link>
              <Link href="/register" className={`${styles.submitButton} ${styles.secondaryButton}`}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
