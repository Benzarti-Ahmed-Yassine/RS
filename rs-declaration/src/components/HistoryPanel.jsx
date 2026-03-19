import { Download, Trash2, Clock } from 'lucide-react'
import styles from './HistoryPanel.module.css'

export default function HistoryPanel({ history, onClear }) {
  if (!history || history.length === 0) {
    return (
      <div className={styles.empty}>
        <Clock size={24} className="text-dim" />
        <p>Aucun historique disponible</p>
      </div>
    )
  }

  const downloadXML = (item) => {
    const blob = new Blob([item.xml], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `declaration_RS_${item.factureNum || 'export'}.xml`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {history.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.info}>
              <div className={styles.row}>
                <span className={styles.supplier}>{item.fournisseur}</span>
                <span className={styles.date}>
                  {new Date(item.dateGened).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.factureInfo}>Facture: {item.factureNum}</div>
            </div>
            <button className={styles.downloadBtn} onClick={() => downloadXML(item)} title="Télécharger XML">
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
      <button className={styles.clearBtn} onClick={onClear}>
        <Trash2 size={16} /> Vider l'historique
      </button>
    </div>
  )
}
