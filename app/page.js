import styles from './page.module.css';
import Login from './login/login';

export default function Home() {
  return (
    <div className={styles.page}>
      <Login />
    </div>
  );
}
