'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/dashboard.module.css';
import { supabase } from '@/utils/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSavings: '0',
    totalMembers: '0',
    nextMeeting: 'Not scheduled',
    recentTransactions: []
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }
      
      setUser(session.user);
      setLoading(false);

      // Simulate fetching stats
      setStats({
        totalSavings: 'KES 150,000',
        totalMembers: '25',
        nextMeeting: 'June 15, 2024',
        recentTransactions: [
          { id: 1, type: 'deposit', amount: 'KES 5,000', date: '2024-03-10', member: 'John Doe' },
          { id: 2, type: 'withdrawal', amount: 'KES 2,000', date: '2024-03-09', member: 'Jane Smith' },
          { id: 3, type: 'deposit', amount: 'KES 3,000', date: '2024-03-08', member: 'Mike Johnson' },
        ]
      });
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.window}>
            <div className={styles.windowHeader}>
              <div className={styles.headerTop}>
                <h1>M-Chama</h1>
                <div className={styles.headerControls}>
                  <div className={styles.dropdown}>
                    <button 
                      className={styles.dropdownButton}
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                      Menu ▼
                    </button>
                    {isMenuOpen && (
                      <div className={styles.dropdownContent}>
                        <button className={`${styles.dropdownItem} ${styles.active}`}>Dashboard</button>
                        <button className={styles.dropdownItem}>Members</button>
                        <button className={styles.dropdownItem}>Transactions</button>
                        <button className={styles.dropdownItem}>Meetings</button>
                        <button className={styles.dropdownItem}>Settings</button>
                      </div>
                    )}
                  </div>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                  </button>
                </div>
              </div>
              <p className={styles.welcomeText}>Welcome, {user?.email?.replace('@mchama.com', '')}</p>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total Savings</h3>
                <p className={styles.statValue}>{stats.totalSavings}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Total Members</h3>
                <p className={styles.statValue}>{stats.totalMembers}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Next Meeting</h3>
                <p className={styles.statValue}>{stats.nextMeeting}</p>
              </div>
            </div>
          </div>

          <div className={styles.window}>
            <div className={styles.windowHeader}>
              <h2>Dashboard Overview</h2>
            </div>
            <div className={styles.actionsAndTransactions}>
              <div className={styles.quickActions}>
                <h3>Quick Actions</h3>
                <div className={styles.actionButtons}>
                  <button className={styles.actionButton}>Make Deposit</button>
                  <button className={styles.actionButton}>Request Withdrawal</button>
                  <button className={styles.actionButton}>Add Member</button>
                  <button className={styles.actionButton}>Schedule Meeting</button>
                </div>
              </div>

              <div className={styles.transactionsSection}>
                <h3>Recent Transactions</h3>
                <div className={styles.transactionsTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Member</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{transaction.date}</td>
                          <td className={styles[transaction.type]}>{transaction.type}</td>
                          <td>{transaction.member}</td>
                          <td>{transaction.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}