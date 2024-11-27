import { useState } from 'react';
import styles from './groups.module.css';

export default function WithdrawalModal({ isOpen, onClose, onSubmit }) {
  const [withdrawal, setWithdrawal] = useState({
    amount: '',
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    onSubmit({ ...withdrawal, date: currentDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Request Withdrawal</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Amount (KES)</label>
            <input
              type="number"
              value={withdrawal.amount}
              onChange={(e) =>
                setWithdrawal({ ...withdrawal, amount: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Reason</label>
            <textarea
              value={withdrawal.reason}
              onChange={(e) =>
                setWithdrawal({ ...withdrawal, reason: e.target.value })
              }
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}
