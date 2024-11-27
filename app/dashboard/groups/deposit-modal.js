import { useState } from 'react';
import styles from './groups.module.css';

export default function DepositModal({ isOpen, onClose, onSubmit }) {
  const [deposit, setDeposit] = useState({
    amount: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    onSubmit({ ...deposit, date: currentDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Make a Deposit</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Amount (KES)</label>
            <input
              type="number"
              value={deposit.amount}
              onChange={(e) =>
                setDeposit({ ...deposit, amount: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea
              value={deposit.description}
              onChange={(e) =>
                setDeposit({ ...deposit, description: e.target.value })
              }
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Submit Deposit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
