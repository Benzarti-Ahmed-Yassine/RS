function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Convert DT amount to millimes (×1000), rounded to integer */
function mil(n) {
  return Math.round((n ?? 0) * 1000)
}

/**
 * Generates the DeclarationsRS XML string.
 *
 * @param {object} declarant   - { typeId, identifiant, categorie }
 * @param {object} reference   - { annee, mois }
 * @param {object} beneficiaire
 * @param {object} invoice     - { date, facture_num }
 * @param {string} rsId        - e.g. "RS7_000001"
 * @param {array}  tvaGroups   - [{ tva_pct, ht, tva_amt, ttc, taux_rs }]
 * @param {string} cnpc
 */
export function generateXML({ declarant, reference, beneficiaire, invoice, rsId, tvaGroups, cnpc = '0' }) {
  const annee = reference.annee || new Date().getFullYear()
  const mois  = String(reference.mois || new Date().getMonth() + 1).padStart(2, '0')

  // Build Operation blocks — one per TVA group
  let sumHT = 0, sumTVA = 0, sumTTC = 0, sumRS = 0

  const operations = tvaGroups.map((g) => {
    const mHT  = mil(g.ht)
    const mTVA = mil(g.tva_amt)
    const mTTC = mil(g.ttc)
    const mRS  = mil(g.ht * g.taux_rs / 100)
    const mNet = mTTC - mRS
    sumHT  += mHT
    sumTVA += mTVA
    sumTTC += mTTC
    sumRS  += mRS
    return `
        <Operation IdTypeOperation="${esc(rsId)}">
          <AnneeFacturation>${annee}</AnneeFacturation>
          <CNPC>${cnpc}</CNPC>
          <P_Charge>0</P_Charge>
          <MontantHT>${mHT}</MontantHT>
          <TauxRS>${g.taux_rs}</TauxRS>
          <TauxTVA>${g.tva_pct}</TauxTVA>
          <MontantTVA>${mTVA}</MontantTVA>
          <MontantTTC>${mTTC}</MontantTTC>
          <MontantRS>${mRS}</MontantRS>
          <MontantNetServi>${mNet}</MontantNetServi>
        </Operation>`
  }).join('')

  const sumNet = sumTTC - sumRS

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<DeclarationsRS VersionSchema="1.0">
  <Declarant>
    <TypeIdentifiant>${esc(declarant.typeId)}</TypeIdentifiant>
    <Identifiant>${esc(declarant.identifiant)}</Identifiant>
    <CategorieContribuable>${esc(declarant.categorie)}</CategorieContribuable>
  </Declarant>
  <ReferenceDeclaration>
    <ActeDepot>0</ActeDepot>
    <AnneeDepot>${annee}</AnneeDepot>
    <MoisDepot>${mois}</MoisDepot>
  </ReferenceDeclaration>
  <AjouterCertificats>
    <Certificat>
      <Beneficiaire>
        <IdTaxpayer>
          <MatriculeFiscal>
            <TypeIdentifiant>${esc(beneficiaire.typeId)}</TypeIdentifiant>
            <Identifiant>${esc(beneficiaire.identifiant)}</Identifiant>
            <CategorieContribuable>${esc(beneficiaire.categorie)}</CategorieContribuable>
          </MatriculeFiscal>
        </IdTaxpayer>
        <Resident>${esc(beneficiaire.resident)}</Resident>
        <NometprenonOuRaisonsociale>${esc(beneficiaire.nom)}</NometprenonOuRaisonsociale>
        <Adresse>${esc(beneficiaire.adresse)}</Adresse>
        <Activite>${esc(beneficiaire.activite)}</Activite>
        <InfosContact>
          <AdresseMail>${esc(beneficiaire.email)}</AdresseMail>
          <NumTel>${esc(beneficiaire.tel)}</NumTel>
        </InfosContact>
      </Beneficiaire>
      <DatePayement>${esc(invoice.date)}</DatePayement>
      <Ref_certif_chez_declarant>${esc(invoice.facture_num)}</Ref_certif_chez_declarant>
      <ListeOperations>${operations}
      </ListeOperations>
      <TotalPayement>
        <TotalMontantHT>${sumHT}</TotalMontantHT>
        <TotalMontantTVA>${sumTVA}</TotalMontantTVA>
        <TotalMontantTTC>${sumTTC}</TotalMontantTTC>
        <TotalMontantRS>${sumRS}</TotalMontantRS>
        <TotalMontantNetServi>${sumNet}</TotalMontantNetServi>
      </TotalPayement>
    </Certificat>
  </AjouterCertificats>
</DeclarationsRS>`
}
