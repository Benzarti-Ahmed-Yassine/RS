import styles from './Panel.module.css'

export default function Panel({ title, children, accent, className = '' }) {
  return (
    <div className={`${styles.panel} ${className}`}>
      {title && (
        <div className={styles.header}>
          <span
            className={styles.dot}
            style={accent ? { background: accent } : {}}
          />
          <h2 className={styles.title}>{title}</h2>
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
