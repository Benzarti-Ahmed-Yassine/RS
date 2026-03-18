import styles from './ExtractedTable.module.css'

function fmt(n) {
  return Number(n ?? 0).toLocaleString('fr-TN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}

export default function ExtractedTable({ invoiceData }) {
  if (!invoiceData) return null

  const { lignes = [], total_ht, total_tva, timbre_fiscal, total_ttc, facture_num, date } = invoiceData

  return (
    <div className={styles.wrap}>
      {/* Invoice header info */}
      <div className={styles.invoiceHeader}>
        <div className={styles.invoiceInfo}>
          <span className={styles.infoLabel}>FACTURE</span>
          <span className={styles.infoValue}>{facture_num || '—'}</span>
        </div>
        <div className={styles.invoiceInfo}>
          <span className={styles.infoLabel}>DATE</span>
          <span className={styles.infoValue}>{date || '—'}</span>
        </div>
        <div className={styles.invoiceInfo}>
          <span className={styles.infoLabel}>FOURNISSEUR</span>
          <span className={styles.infoValue}>{invoiceData.fournisseur?.nom || '—'}</span>
        </div>
        <div className={styles.invoiceInfo}>
          <span className={styles.infoLabel}>CLIENT</span>
          <span className={styles.infoValue}>{invoiceData.client?.nom || '—'}</span>
        </div>
      </div>

      {/* Lines table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>LIBELLÉ</th>
              <th className={styles.num}>QTÉ</th>
              <th className={styles.num}>PU HT</th>
              <th className={styles.num}>PT HT</th>
              <th className={styles.num}>TVA</th>
              <th className={styles.num}>TOTAL TTC</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l, i) => {
              const tva = l.tva_pct ?? 0
              return (
                <tr key={i}>
                  <td className={styles.libelle}>{l.libelle}</td>
                  <td className={styles.num}>{l.quantite} <span className={styles.unit}>{l.unite}</span></td>
                  <td className={styles.num}>{fmt(l.pu_ht)}</td>
                  <td className={styles.num}>{fmt(l.pt_ht)}</td>
                  <td className={styles.num}>
                    <span className={`${styles.tvaBadge} ${tva === 0 ? styles.tvaZero : tva === 19 ? styles.tva19 : styles.tvaOther}`}>
                      {tva}%
                    </span>
                  </td>
                  <td className={`${styles.num} ${styles.ttcVal}`}>{fmt(l.total_ttc)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Total HT</span>
          <span className={styles.totalVal}>{fmt(total_ht)} DT</span>
        </div>
        <div className={styles.totalRow}>
          <span>Total TVA</span>
          <span className={styles.totalVal}>{fmt(total_tva)} DT</span>
        </div>
        {(timbre_fiscal > 0) && (
          <div className={styles.totalRow}>
            <span>Timbre Fiscal</span>
            <span className={styles.totalVal}>{fmt(timbre_fiscal)} DT</span>
          </div>
        )}
        <div className={`${styles.totalRow} ${styles.totalTTC}`}>
          <span>TOTAL TTC</span>
          <span className={styles.totalTTCVal}>{fmt(total_ttc)} DT</span>
        </div>
      </div>
    </div>
  )
}
