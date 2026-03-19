import { Download, Trash2, ShieldAlert } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import styles from './HistoryPage.module.css'

export default function HistoryPage() {
  const { history, clearHistory, downloadXML } = useHistory()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Archives des Déclarations</h1>
          <p className={styles.subtitle}>Retrouvez et téléchargez vos anciens fichiers XML générés.</p>
        </div>
        {history.length > 0 && (
          <button className={styles.clearBtn} onClick={clearHistory}>
            <Trash2 size={16} /> Vider l'historique
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <ShieldAlert size={48} className="text-dim" />
          <h2>Aucun historique enregistré</h2>
          <p>Les fichiers XML que vous allez générer apparaitront sur cette page.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date de Génération</th>
                <th>Fournisseur / Bénéficiaire</th>
                <th>N° Facture</th>
                <th>Type d'Opération</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td className={styles.dateCell}>{new Date(item.dateGened).toLocaleString()}</td>
                  <td className={styles.boldCell}>{item.fournisseur}</td>
                  <td className={styles.monoCell}>{item.factureNum}</td>
                  <td className={styles.badgeCell}>
                    <span className={styles.badge}>{item.rsId || 'Inconnu'}</span>
                  </td>
                  <td className={styles.actionCell}>
                    <button className={styles.downloadBtn} onClick={() => downloadXML(item)}>
                      <Download size={16} /> XML
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
