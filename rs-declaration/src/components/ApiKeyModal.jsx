import { useState } from 'react'
import { X, Key, ExternalLink, Eye, EyeOff } from 'lucide-react'
import styles from './ApiKeyModal.module.css'

export default function ApiKeyModal({ apiKey, onSave, onClose }) {
  const [value, setValue] = useState(apiKey || '')
  const [show, setShow]   = useState(false)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.iconWrap}><Key size={18} /></div>
          <div>
            <h2 className={styles.title}>Clé API Anthropic</h2>
            <p className={styles.sub}>Requise pour l'extraction par Claude Vision</p>
          </div>
          <button className={styles.close} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.body}>
          <div className={styles.infoBox}>
            <strong>Comment ça marche :</strong>
            <ol className={styles.steps}>
              <li>Créez un compte sur <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com <ExternalLink size={11}/></a></li>
              <li>Générez une clé API dans <em>API Keys</em></li>
              <li>Collez-la ci-dessous — elle est stockée uniquement dans votre navigateur (localStorage)</li>
            </ol>
          </div>

          <label className={styles.label}>VOTRE CLÉ API</label>
          <div className={styles.inputWrap}>
            <input
              type={show ? 'text' : 'password'}
              className={styles.input}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="sk-ant-api03-..."
              spellCheck={false}
            />
            <button className={styles.eye} onClick={() => setShow(s => !s)}>
              {show ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>

          <p className={styles.note}>
            ⚠ Ne partagez jamais votre clé. Pour un déploiement public, utilisez un backend proxy.
          </p>
        </div>

        <div className={styles.footer}>
          <button className={styles.btnSecondary} onClick={onClose}>Annuler</button>
          <button
            className={styles.btnPrimary}
            onClick={() => { onSave(value.trim()); onClose() }}
            disabled={!value.trim().startsWith('sk-ant')}
          >
            Enregistrer la clé
          </button>
        </div>
      </div>
    </div>
  )
}
