import { useRef, useState } from 'react'
import { Upload, FileImage, X } from 'lucide-react'
import styles from './UploadZone.module.css'

export default function UploadZone({ file, preview, onFile }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  const clear = (e) => {
    e.stopPropagation()
    onFile(null)
    inputRef.current.value = ''
  }

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''} ${file ? styles.hasFile : ''}`}
      onClick={() => !file && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files[0]; if (f) onFile(f) }}
      />

      {!file ? (
        <div className={styles.empty}>
          <div className={styles.iconRing}>
            <Upload size={24} />
          </div>
          <p className={styles.mainText}>Glissez votre facture ici</p>
          <p className={styles.subText}>PNG · JPG · PDF — ou cliquez pour parcourir</p>
        </div>
      ) : (
        <div className={styles.filePreview}>
          {preview ? (
            <img src={preview} alt="Aperçu facture" className={styles.previewImg} />
          ) : (
            <div className={styles.pdfIcon}>
              <FileImage size={32} />
              <span>{file.name}</span>
            </div>
          )}
          <button className={styles.clearBtn} onClick={clear} title="Supprimer">
            <X size={14} />
          </button>
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{file.name}</span>
            <span className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB</span>
          </div>
        </div>
      )}
    </div>
  )
}
