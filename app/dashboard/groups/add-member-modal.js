import { useState } from 'react';
import styles from './groups.module.css';

export default function AddMemberModal({ isOpen, onClose, onSubmit }) {
  const [member, setMember] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(member);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Add Member</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => setMember({ ...member, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Add Member</button>
          </div>
        </form>
      </div>
    </div>
  );
}
