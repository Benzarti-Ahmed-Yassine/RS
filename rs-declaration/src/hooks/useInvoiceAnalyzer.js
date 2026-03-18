import { useState, useCallback } from 'react'
import { extractInvoiceData } from '../utils/anthropicClient'
import { groupByTVA } from '../utils/tvaGrouper'
import { generateXML } from '../utils/xmlGenerator'

const defaultDeclarant = {
  typeId: '1', identifiant: '', categorie: 'PM',
}
const defaultBeneficiaire = {
  typeId: '1', identifiant: '', categorie: 'PM',
  resident: '1', nom: '', adresse: '',
  activite: 'fournisseur', email: '', tel: '',
}
const defaultReference = {
  annee: String(new Date().getFullYear()),
  mois: String(new Date().getMonth() + 1).padStart(2, '0'),
}

export function useInvoiceAnalyzer() {
  // API key (runtime input)
  const [apiKey, setApiKey]       = useState(import.meta.env.VITE_ANTHROPIC_API_KEY || '')
  const [showKeyModal, setShowKeyModal] = useState(false)

  // File
  const [file, setFile]           = useState(null)
  const [preview, setPreview]     = useState(null)
  const [base64, setBase64]       = useState('')
  const [mimeType, setMimeType]   = useState('')

  // Extraction
  const [status, setStatus]       = useState(null) // { type: 'loading'|'success'|'error', msg }
  const [invoiceData, setInvoiceData] = useState(null)

  // Form state
  const [declarant, setDeclarant]           = useState(defaultDeclarant)
  const [beneficiaire, setBeneficiaire]     = useState(defaultBeneficiaire)
  const [reference, setReference]           = useState(defaultReference)
  const [refCertif, setRefCertif]           = useState('')
  const [cnpc, setCnpc]                     = useState('0')

  // RS selection
  const [rsCategorie, setRsCategorie]       = useState('')
  const [rsId, setRsId]                     = useState('')

  // TVA groups (editable)
  const [tvaGroups, setTvaGroups]           = useState([])
  const [globalTauxRS, setGlobalTauxRS]     = useState(1.5)

  // XML output
  const [xmlOutput, setXmlOutput]           = useState('')

  // ── File handling ────────────────────────────────────────────────
  const handleFile = useCallback((f) => {
    if (!f) return
    setFile(f)
    setInvoiceData(null)
    setTvaGroups([])
    setXmlOutput('')
    setStatus(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target.result
      setBase64(result.split(',')[1])
      setMimeType(f.type || 'image/jpeg')
      if (f.type.startsWith('image/')) setPreview(result)
      else setPreview(null)
    }
    reader.readAsDataURL(f)
  }, [])

  // ── Analyze ──────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!base64) return setStatus({ type: 'error', msg: 'Veuillez uploader une facture.' })
    if (!rsId)   return setStatus({ type: 'error', msg: 'Veuillez sélectionner un type d\'opération RS.' })

    const key = apiKey?.trim()
    if (!key) { setShowKeyModal(true); return }

    setStatus({ type: 'loading', msg: 'Analyse de la facture par Claude Vision…' })

    try {
      const data = await extractInvoiceData(base64, key)
      setInvoiceData(data)

      // Auto-fill forms
      if (data.fournisseur) {
        setBeneficiaire(prev => ({
          ...prev,
          nom:          data.fournisseur.nom     || prev.nom,
          adresse:      data.fournisseur.adresse || prev.adresse,
          tel:          data.fournisseur.tel     || prev.tel,
          email:        data.fournisseur.email   || prev.email,
          identifiant:  data.fournisseur.identifiant || prev.identifiant,
        }))
      }
      if (data.client?.identifiant) {
        setDeclarant(prev => ({ ...prev, identifiant: data.client.identifiant }))
      }
      if (data.date) {
        const parts = data.date.split('/')
        if (parts.length === 3) {
          setReference({ annee: parts[2], mois: parts[1].padStart(2, '0') })
        }
      }
      if (data.facture_num) setRefCertif(data.facture_num)

      // Build TVA groups
      const groups = groupByTVA(data.lignes || [], globalTauxRS)
      setTvaGroups(groups)

      setStatus({ type: 'success', msg: `Facture ${data.facture_num || ''} analysée — ${groups.length} groupe(s) TVA détecté(s)` })
    } catch (err) {
      const messages = {
        API_KEY_MISSING: 'Clé API manquante. Cliquez sur l\'icône ⚙ pour la saisir.',
        API_KEY_INVALID: 'Clé API invalide (401). Vérifiez votre clé sur console.anthropic.com.',
        RATE_LIMIT: 'Limite de taux atteinte. Réessayez dans quelques secondes.',
      }
      setStatus({ type: 'error', msg: messages[err.message] || err.message })
      if (err.message === 'API_KEY_MISSING') setShowKeyModal(true)
    }
  }, [base64, mimeType, apiKey, rsId, globalTauxRS])

  // ── Update TVA group RS rate ─────────────────────────────────────
  const updateGroupRS = useCallback((index, value) => {
    setTvaGroups(prev => prev.map((g, i) => i === index ? { ...g, taux_rs: parseFloat(value) || 0 } : g))
  }, [])

  // ── Apply global RS to all groups ────────────────────────────────
  const applyGlobalRS = useCallback(() => {
    setTvaGroups(prev => prev.map(g => ({ ...g, taux_rs: globalTauxRS })))
  }, [globalTauxRS])

  // ── Generate XML ─────────────────────────────────────────────────
  const generateXMLOutput = useCallback(() => {
    if (!rsId) return setStatus({ type: 'error', msg: 'Sélectionnez un type d\'opération RS.' })
    if (tvaGroups.length === 0) return setStatus({ type: 'error', msg: 'Analysez une facture d\'abord.' })

    const xml = generateXML({
      declarant,
      reference,
      beneficiaire,
      invoice: { date: invoiceData?.date || '', facture_num: refCertif },
      rsId,
      tvaGroups,
      cnpc,
    })
    setXmlOutput(xml)
  }, [declarant, reference, beneficiaire, invoiceData, refCertif, rsId, tvaGroups, cnpc])

  // ── Download XML ─────────────────────────────────────────────────
  const downloadXML = useCallback(() => {
    if (!xmlOutput) return
    const blob = new Blob([xmlOutput], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `declaration_RS_${refCertif || 'export'}.xml`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [xmlOutput, refCertif])

  return {
    // API key
    apiKey, setApiKey, showKeyModal, setShowKeyModal,
    // File
    file, preview, handleFile,
    // Status
    status,
    // Data
    invoiceData, tvaGroups, updateGroupRS,
    globalTauxRS, setGlobalTauxRS, applyGlobalRS,
    // Forms
    declarant, setDeclarant,
    beneficiaire, setBeneficiaire,
    reference, setReference,
    refCertif, setRefCertif,
    cnpc, setCnpc,
    // RS
    rsCategorie, setRsCategorie,
    rsId, setRsId,
    // Actions
    analyze, generateXMLOutput, downloadXML,
    // Output
    xmlOutput,
  }
}
