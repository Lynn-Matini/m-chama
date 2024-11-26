import styles from '../page.module.css';
import Login from './login';

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Login />
    </div>
  );
}