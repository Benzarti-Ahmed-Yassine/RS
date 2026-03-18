import styles from './DeclarantForm.module.css'

const TYPE_OPTIONS = [
  { value: '1', label: '1 – Matricule Fiscal' },
  { value: '2', label: '2 – CIN' },
  { value: '3', label: '3 – CS' },
  { value: '4', label: '4 – Passeport' },
]
const CAT_OPTIONS = [
  { value: 'PM', label: 'PM – Personne Morale' },
  { value: 'PP', label: 'PP – Personne Physique' },
]

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}

export default function DeclarantForm({
  declarant, setDeclarant,
  beneficiaire, setBeneficiaire,
  reference, setReference,
  refCertif, setRefCertif,
  cnpc, setCnpc,
}) {
  const updD = (k, v) => setDeclarant(p => ({ ...p, [k]: v }))
  const updB = (k, v) => setBeneficiaire(p => ({ ...p, [k]: v }))
  const updR = (k, v) => setReference(p => ({ ...p, [k]: v }))

  return (
    <div className={styles.wrap}>

      {/* ── Déclarant ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><span className={styles.dot} />Déclarant</h3>
        <div className={styles.row2}>
          <Field label="TYPE IDENTIFIANT">
            <select className={styles.select} value={declarant.typeId} onChange={e => updD('typeId', e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="CATÉGORIE">
            <select className={styles.select} value={declarant.categorie} onChange={e => updD('categorie', e.target.value)}>
              {CAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="IDENTIFIANT FISCAL">
          <input className={styles.input} value={declarant.identifiant}
            onChange={e => updD('identifiant', e.target.value)} placeholder="ex: 1323301MAM000" />
        </Field>
        <div className={styles.row2}>
          <Field label="ANNÉE DÉPÔT">
            <input className={styles.input} value={reference.annee}
              onChange={e => updR('annee', e.target.value)} placeholder="2025" maxLength={4} />
          </Field>
          <Field label="MOIS DÉPÔT">
            <input className={styles.input} value={reference.mois}
              onChange={e => updR('mois', e.target.value)} placeholder="08" maxLength={2} />
          </Field>
        </div>
      </section>

      {/* ── Bénéficiaire ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><span className={styles.dot} style={{background:'var(--teal)'}} />Bénéficiaire (Fournisseur)</h3>
        <Field label="NOM / RAISON SOCIALE">
          <input className={styles.input} value={beneficiaire.nom}
            onChange={e => updB('nom', e.target.value)} placeholder="Rempli automatiquement" />
        </Field>
        <div className={styles.row2}>
          <Field label="TYPE IDENTIFIANT">
            <select className={styles.select} value={beneficiaire.typeId} onChange={e => updB('typeId', e.target.value)}>
              {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="CATÉGORIE">
            <select className={styles.select} value={beneficiaire.categorie} onChange={e => updB('categorie', e.target.value)}>
              {CAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="IDENTIFIANT FISCAL">
          <input className={styles.input} value={beneficiaire.identifiant}
            onChange={e => updB('identifiant', e.target.value)} placeholder="Rempli automatiquement" />
        </Field>
        <div className={styles.row2}>
          <Field label="RÉSIDENT">
            <select className={styles.select} value={beneficiaire.resident} onChange={e => updB('resident', e.target.value)}>
              <option value="1">1 – Résident</option>
              <option value="0">0 – Non-résident</option>
            </select>
          </Field>
          <Field label="ACTIVITÉ">
            <input className={styles.input} value={beneficiaire.activite}
              onChange={e => updB('activite', e.target.value)} placeholder="fournisseur" />
          </Field>
        </div>
        <Field label="ADRESSE">
          <input className={styles.input} value={beneficiaire.adresse}
            onChange={e => updB('adresse', e.target.value)} placeholder="Rempli automatiquement" />
        </Field>
        <div className={styles.row2}>
          <Field label="EMAIL">
            <input className={styles.input} value={beneficiaire.email}
              onChange={e => updB('email', e.target.value)} placeholder="contact@..." />
          </Field>
          <Field label="TÉL">
            <input className={styles.input} value={beneficiaire.tel}
              onChange={e => updB('tel', e.target.value)} placeholder="+216..." />
          </Field>
        </div>
      </section>

      {/* ── Référence ── */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}><span className={styles.dot} style={{background:'var(--blue)'}} />Référence certificat</h3>
        <div className={styles.row2}>
          <Field label="REF. CERTIFICAT">
            <input className={styles.input} value={refCertif}
              onChange={e => setRefCertif(e.target.value)} placeholder="2025/05000001" />
          </Field>
          <Field label="CNPC">
            <select className={styles.select} value={cnpc} onChange={e => setCnpc(e.target.value)}>
              <option value="0">0 – Non</option>
              <option value="1">1 – Oui</option>
            </select>
          </Field>
        </div>
      </section>
    </div>
  )
}
