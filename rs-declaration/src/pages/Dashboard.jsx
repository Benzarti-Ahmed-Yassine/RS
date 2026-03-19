import { useInvoiceAnalyzer } from '../hooks/useInvoiceAnalyzer'
import { RotateCcw } from 'lucide-react'

import Panel         from '../components/Panel'
import UploadZone    from '../components/UploadZone'
import DeclarantForm from '../components/DeclarantForm'
import RsTypeSelector from '../components/RsTypeSelector'
import StatusBar      from '../components/StatusBar'
import ExtractedTable from '../components/ExtractedTable'
import TvaGroupsTable from '../components/TvaGroupsTable'
import XmlOutput      from '../components/XmlOutput'
import HistoryPanel   from '../components/HistoryPanel'

import styles from './Dashboard.module.css'

export default function Dashboard() {
  const state = useInvoiceAnalyzer()

  return (
    <div className={styles.layout}>
      {/* ── LEFT COLUMN ── */}
      <div className={styles.left}>
        {/* Upload */}
        <Panel title="Facture à analyser">
          <UploadZone
            file={state.file}
            preview={state.preview}
            onFile={state.handleFile}
          />
        </Panel>

        {/* RS Type */}
        <Panel title="Type d'opération RS" accent="var(--teal)">
          <RsTypeSelector
            rsCategorie={state.rsCategorie}
            setRsCategorie={state.setRsCategorie}
            rsId={state.rsId}
            setRsId={state.setRsId}
            globalTauxRS={state.globalTauxRS}
            setGlobalTauxRS={state.setGlobalTauxRS}
            applyGlobalRS={state.applyGlobalRS}
          />
        </Panel>

        {/* Declarant + Beneficiaire form */}
        <Panel title="Déclarant & Bénéficiaire" accent="var(--blue)">
          <DeclarantForm
            declarant={state.declarant}
            setDeclarant={state.setDeclarant}
            beneficiaire={state.beneficiaire}
            setBeneficiaire={state.setBeneficiaire}
            reference={state.reference}
            setReference={state.setReference}
            refCertif={state.refCertif}
            setRefCertif={state.setRefCertif}
            cnpc={state.cnpc}
            setCnpc={state.setCnpc}
          />
        </Panel>

        {/* History Panel */}
        <Panel title="Historique récent" accent="var(--text3)">
          <HistoryPanel history={state.history} onClear={state.clearHistory} />
        </Panel>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className={styles.right}>
        {/* Analyze button + status */}
        <Panel title="Analyse & Génération">
          <div className={styles.analyzeSection}>
            <StatusBar status={state.status} />
            <div className={styles.analyzeActions}>
              <button
                className={styles.analyzeBtn}
                onClick={state.analyze}
                disabled={!state.file || state.status?.type === 'loading'}
              >
                {state.status?.type === 'loading' ? (
                  <>
                    <span className={styles.btnSpinner} />
                    Analyse en cours…
                  </>
                ) : (
                  <>🔍 Analyser la facture</>
                )}
              </button>
              <button
                className={styles.resetBtn}
                onClick={state.resetApp}
                title="Réinitialiser"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </Panel>

        {/* Extracted invoice data */}
        {state.invoiceData && (
          <Panel title="Données extraites" accent="var(--teal)" className={styles.fadeUp}>
            <ExtractedTable invoiceData={state.invoiceData} />
          </Panel>
        )}

        {/* TVA groups */}
        {state.tvaGroups.length > 0 && (
          <Panel title="Groupes TVA → Opérations XML" accent="var(--amber)" className={styles.fadeUp}>
            <TvaGroupsTable
              tvaGroups={state.tvaGroups}
              onUpdateRS={state.updateGroupRS}
            />
          </Panel>
        )}

        {/* XML output */}
        <Panel title="Fichier XML Déclaration RS" accent="var(--amber)">
          <XmlOutput
            xml={state.xmlOutput}
            onGenerate={state.generateXMLOutput}
            onDownload={state.downloadXML}
            hasData={state.tvaGroups.length > 0 && !!state.rsId}
          />
        </Panel>
      </div>
    </div>
  )
}
