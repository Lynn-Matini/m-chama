import { useState } from 'react';
import styles from './groups.module.css';

export default function ScheduleMeetingModal({ isOpen, onClose, onSubmit }) {
  const [meeting, setMeeting] = useState({
    date: '',
    agenda: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(meeting);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Schedule Meeting</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Date and Time</label>
            <input
              type="datetime-local"
              value={meeting.date}
              onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Agenda</label>
            <textarea
              value={meeting.agenda}
              onChange={(e) =>
                setMeeting({ ...meeting, agenda: e.target.value })
              }
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
