/**
 * Groups invoice lines by TVA rate.
 * Returns one group per distinct tva_pct, with aggregated HT, TVA, TTC.
 */
export function groupByTVA(lignes = [], defaultTauxRS = 1.5) {
  const map = {}

  lignes.forEach((l) => {
    const key = String(l.tva_pct ?? 0)
    if (!map[key]) {
      map[key] = {
        tva_pct: l.tva_pct ?? 0,
        ht: 0,
        tva_amt: 0,
        ttc: 0,
        taux_rs: defaultTauxRS,
        lignes: [],
      }
    }
    map[key].ht += l.pt_ht ?? 0
    map[key].ttc += l.total_ttc ?? 0
    map[key].lignes.push(l)
  })

  // Recompute TVA from HT × rate (more accurate than summing per-line)
  Object.values(map).forEach((g) => {
    g.tva_amt = g.ht * g.tva_pct / 100
  })

  return Object.values(map).sort((a, b) => a.tva_pct - b.tva_pct)
}

export function computeGroupTotals(groups) {
  return groups.reduce(
    (acc, g) => {
      const rs = g.ttc * g.taux_rs / 100
      acc.sumHT += g.ht
      acc.sumTVA += g.tva_amt
      acc.sumTTC += g.ttc
      acc.sumRS += rs
      return acc
    },
    { sumHT: 0, sumTVA: 0, sumTTC: 0, sumRS: 0 }
  )
}
