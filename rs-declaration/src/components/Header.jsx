import { Settings, FileText } from 'lucide-react'
import styles from './Header.module.css'

export default function Header({ onSettingsClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <FileText size={20} />
        </div>
        <div>
          <h1 className={styles.title}>
            RS <span>Declaration</span>
          </h1>
          <p className={styles.sub}>Décodeur facture → XML Retenue à la Source · DGI Tunisie</p>
        </div>
      </div>
      <div className={styles.actions}>
        <span className={styles.badge}>v1.0 · TN</span>
        <button className={styles.settingsBtn} onClick={onSettingsClick} title="Configurer la clé API">
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}
