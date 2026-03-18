import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import styles from './XmlOutput.module.css'

function syntaxHighlight(xml) {
  // Escape first, then colorize
  return xml
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // XML declaration
    .replace(/(&lt;\?xml[^?]*\?&gt;)/g, '<span class="xml-decl">$1</span>')
    // Closing tags
    .replace(/(&lt;\/)([\w:]+)(&gt;)/g, '<span class="xml-bracket">$1</span><span class="xml-tag">$2</span><span class="xml-bracket">$3</span>')
    // Opening tags with attributes
    .replace(/(&lt;)([\w:]+)((?:\s[\w:]+="[^"]*")*)\s*(\/?&gt;)/g,
      '<span class="xml-bracket">$1</span><span class="xml-tag">$2</span><span class="xml-attrs">$3</span><span class="xml-bracket">$4</span>')
    // Attribute names and values
    .replace(/class="xml-attrs">(.*?)<\/span>/gs, (_, inner) => {
      const colored = inner.replace(/([\w:]+)(="[^"]*")/g,
        '<span class="xml-attr-name">$1</span><span class="xml-attr-eq">=</span><span class="xml-attr-val">$2</span>')
      return `class="xml-attrs">${colored}</span>`
    })
    // Text content (values between tags)
    .replace(/(&gt;)([^&<\n]+?)(&lt;)/g, '$1<span class="xml-text">$2</span>$3')
}

export default function XmlOutput({ xml, onGenerate, onDownload, hasData }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(xml).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.wrap}>
      {/* Action bar */}
      <div className={styles.actionBar}>
        <button
          className={styles.generateBtn}
          onClick={onGenerate}
          disabled={!hasData}
        >
          ⚡ Générer le XML
        </button>
        {xml && (
          <div className={styles.rightActions}>
            <button className={styles.iconBtn} onClick={copy} title="Copier">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
            <button className={styles.downloadBtn} onClick={onDownload} title="Télécharger">
              <Download size={15} />
              <span>Télécharger XML</span>
            </button>
          </div>
        )}
      </div>

      {/* XML display */}
      {xml ? (
        <div className={styles.codeWrap}>
          <div className={styles.lineNumbers}>
            {xml.split('\n').map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <pre
            className={styles.code}
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(xml) }}
          />
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📄</div>
          <p>Le XML apparaîtra ici après la génération</p>
          <p className={styles.emptyHint}>Analysez une facture et sélectionnez un type RS d'abord</p>
        </div>
      )}
    </div>
  )
}
