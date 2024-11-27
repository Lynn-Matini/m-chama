'use client';

import { useState, useEffect } from 'react';
import styles from '@/app/dashboard.module.css';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DepositModal from './groups/deposit-modal';
import WithdrawalModal from './groups/withdrawal-modal';
import AddMemberModal from './groups/add-member-modal';
import ScheduleMeetingModal from './groups/schedule-meeting-modal';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] =
    useState(false);
  const [stats, setStats] = useState({
    totalSavings: '0',
    totalMembers: '0',
    nextMeeting: 'Not scheduled',
    recentTransactions: [],
  });
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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
          {
            id: 1,
            type: 'deposit',
            amount: 'KES 5,000',
            date: '2024-03-10',
            member: 'John Doe',
          },
          {
            id: 2,
            type: 'withdrawal',
            amount: 'KES 2,000',
            date: '2024-03-09',
            member: 'Jane Smith',
          },
          {
            id: 3,
            type: 'deposit',
            amount: 'KES 3,000',
            date: '2024-03-08',
            member: 'Mike Johnson',
          },
        ],
      });
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleDepositSubmit = async (deposit) => {
    try {
      const { data, error } = await supabase.from('deposits').insert([
        {
          transaction_id: deposit.transactionId,
          amount: deposit.amount,
          description: deposit.description,
          date: deposit.date,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      console.log('Deposit submitted:', data);
      setStats((prevStats) => ({
        ...prevStats,
        recentTransactions: [
          ...prevStats.recentTransactions,
          {
            id: data[0].id,
            type: 'deposit',
            amount: `KES ${deposit.amount}`,
            date: deposit.date,
            member: user.email,
          },
        ],
      }));
    } catch (error) {
      console.error('Error submitting deposit:', error);
    }
  };

  const handleWithdrawalSubmit = async (withdrawal) => {
    try {
      const { data, error } = await supabase.from('withdrawals').insert([
        {
          amount: withdrawal.amount,
          reason: withdrawal.reason,
          date: withdrawal.date,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      console.log('Withdrawal requested:', data);
      // Update state or UI as needed
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
    }
  };

  const handleAddMemberSubmit = async (member) => {
    try {
      const { data, error } = await supabase.from('members').insert([
        {
          name: member.name,
          email: member.email,
          added_by: user.id,
        },
      ]);

      if (error) throw error;

      console.log('Member added:', data);
      // Update state or UI as needed
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleScheduleMeetingSubmit = async (meeting) => {
    try {
      const { data, error } = await supabase.from('meetings').insert([
        {
          date: meeting.date,
          agenda: meeting.agenda,
          scheduled_by: user.id,
        },
      ]);

      if (error) throw error;

      console.log('Meeting scheduled:', data);
      // Update state or UI as needed
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
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
                        <Link href="/dashboard">
                          <button
                            className={`${styles.dropdownItem} ${
                              pathname === '/dashboard' ? styles.active : ''
                            }`}
                          >
                            Dashboard
                          </button>
                        </Link>
                        <Link href="/dashboard/groups">
                          <button
                            className={`${styles.dropdownItem} ${
                              pathname === '/dashboard/groups'
                                ? styles.active
                                : ''
                            }`}
                          >
                            Groups
                          </button>
                        </Link>
                        <button className={styles.dropdownItem}>Members</button>
                        <button className={styles.dropdownItem}>
                          Transactions
                        </button>
                        <button className={styles.dropdownItem}>
                          Meetings
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Logout
                  </button>
                </div>
              </div>
              <p className={styles.welcomeText}>
                Welcome, {user?.email?.replace('@mchama.com', '')}
              </p>
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
                  <button
                    className={styles.actionButton}
                    onClick={() => setShowDepositModal(true)}
                  >
                    Make Deposit
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => setShowWithdrawalModal(true)}
                  >
                    Request Withdrawal
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => setShowAddMemberModal(true)}
                  >
                    Add Member
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => setShowScheduleMeetingModal(true)}
                  >
                    Schedule Meeting
                  </button>
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
                          <td className={styles[transaction.type]}>
                            {transaction.type}
                          </td>
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
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSubmit={handleDepositSubmit}
      />
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        onSubmit={handleWithdrawalSubmit}
      />
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleAddMemberSubmit}
      />
      <ScheduleMeetingModal
        isOpen={showScheduleMeetingModal}
        onClose={() => setShowScheduleMeetingModal(false)}
        onSubmit={handleScheduleMeetingSubmit}
      />
    </div>
  );
}
