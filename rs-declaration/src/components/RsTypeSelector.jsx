import { useState } from 'react'
import { RS_CATEGORIES, RS_TYPES } from '../data/rsTypes'
import styles from './RsTypeSelector.module.css'

export default function RsTypeSelector({
  rsCategorie, setRsCategorie,
  rsId, setRsId,
  globalTauxRS, setGlobalTauxRS,
  applyGlobalRS,
}) {
  const options = rsCategorie ? (RS_TYPES[rsCategorie] || []) : []

  const handleCat = (e) => {
    setRsCategorie(e.target.value)
    setRsId('')
  }

  const handleCard = (item) => {
    setRsId(item.id)
    setGlobalTauxRS(item.taux)
  }

  return (
    <div className={styles.wrap}>
      {/* Category dropdown */}
      <div className={styles.field}>
        <label className={styles.label}>CATÉGORIE RS</label>
        <select className={styles.select} value={rsCategorie} onChange={handleCat}>
          <option value="">— Sélectionner une catégorie —</option>
          {RS_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Designation cards */}
      {options.length > 0 && (
        <div className={styles.cardsWrap}>
          <p className={styles.cardsLabel}>DÉSIGNATION</p>
          <div className={styles.cards}>
            {options.map(item => (
              <button
                key={item.id}
                className={`${styles.card} ${rsId === item.id ? styles.selected : ''}`}
                onClick={() => handleCard(item)}
              >
                <span className={styles.cardId}>{item.id}</span>
                <span className={styles.cardDesc}>{item.desc}</span>
                <span className={styles.cardTaux}>{item.taux}%</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Global RS rate */}
      <div className={styles.tauxRow}>
        <div className={styles.field} style={{ flex: 1 }}>
          <label className={styles.label}>TAUX RS GLOBAL (%)</label>
          <input
            type="number"
            className={styles.input}
            value={globalTauxRS}
            onChange={e => setGlobalTauxRS(parseFloat(e.target.value) || 0)}
            step="0.5" min="0"
          />
        </div>
        <button className={styles.applyBtn} onClick={applyGlobalRS}>
          Appliquer à tous
        </button>
      </div>

      {rsId && (
        <div className={styles.selectedBadge}>
          <span className={styles.checkmark}>✓</span>
          <span>Opération sélectionnée : <strong>{rsId}</strong></span>
        </div>
      )}
    </div>
  )
}
