import styles from './TvaGroupsTable.module.css'

function fmt(n) {
  return Number(n ?? 0).toLocaleString('fr-TN', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
}

export default function TvaGroupsTable({ tvaGroups, onUpdateRS }) {
  if (!tvaGroups || tvaGroups.length === 0) return null

  const totalRS = tvaGroups.reduce((s, g) => s + g.ttc * g.taux_rs / 100, 0)
  const totalNet = tvaGroups.reduce((s, g) => s + g.ttc - g.ttc * g.taux_rs / 100, 0)

  return (
    <div className={styles.wrap}>
      {tvaGroups.length > 1 && (
        <div className={styles.notice}>
          <span className={styles.noticeIcon}>⚡</span>
          <span>
            <strong>{tvaGroups.length} taux TVA détectés</strong> — une <code>&lt;Operation&gt;</code> XML sera générée par groupe.
            Ajustez le taux RS par groupe si nécessaire.
          </span>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>GROUPE TVA</th>
              <th className={styles.num}>MONTANT HT</th>
              <th className={styles.num}>TVA</th>
              <th className={styles.num}>TOTAL TTC</th>
              <th className={styles.num}>TAUX RS%</th>
              <th className={styles.num}>RS CALCULÉ</th>
              <th className={styles.num}>NET SERVI</th>
            </tr>
          </thead>
          <tbody>
            {tvaGroups.map((g, i) => {
              const rs  = g.ttc * g.taux_rs / 100
              const net = g.ttc - rs
              return (
                <tr key={i}>
                  <td>
                    <span className={`${styles.tvaBadge} ${g.tva_pct === 0 ? styles.zero : styles.nonzero}`}>
                      {g.tva_pct}% TVA
                    </span>
                    <div className={styles.lineCount}>{g.lignes?.length || 0} ligne(s)</div>
                  </td>
                  <td className={styles.num}>{fmt(g.ht)}</td>
                  <td className={styles.num}>{fmt(g.tva_amt)}</td>
                  <td className={styles.num}>{fmt(g.ttc)}</td>
                  <td className={styles.num}>
                    <input
                      type="number"
                      className={styles.rsInput}
                      value={g.taux_rs}
                      min="0"
                      step="0.5"
                      onChange={e => onUpdateRS(i, e.target.value)}
                    />
                  </td>
                  <td className={`${styles.num} ${styles.rsVal}`}>{fmt(rs)} DT</td>
                  <td className={`${styles.num} ${styles.netVal}`}>{fmt(net)} DT</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total RS</span>
          <span className={styles.summaryAmber}>{fmt(totalRS)} DT</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Total Net Servi</span>
          <span className={styles.summaryTeal}>{fmt(totalNet)} DT</span>
        </div>
      </div>
    </div>
  )
}
