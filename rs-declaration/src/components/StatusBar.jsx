import styles from './StatusBar.module.css'

export default function StatusBar({ status }) {
  if (!status) return null

  return (
    <div className={`${styles.bar} ${styles[status.type]}`}>
      {status.type === 'loading' && <span className={styles.spinner} />}
      {status.type === 'success' && <span className={styles.icon}>✓</span>}
      {status.type === 'error'   && <span className={styles.icon}>✗</span>}
      <span className={styles.msg}>{status.msg}</span>
    </div>
  )
}
