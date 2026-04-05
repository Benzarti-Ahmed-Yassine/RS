import { useState, useRef } from 'react'
import { Upload, Download, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import Panel from '../components/Panel'

// Recursive component to render XML DOM visually
function XmlNodeEditor({ node, path, onUpdateNode, onDeleteNode }) {
  const [expanded, setExpanded] = useState(true)

  if (node.nodeType === Node.TEXT_NODE) {
    if (!node.nodeValue.trim()) return null;
    return (
      <div style={{ display: 'flex', marginLeft: 20, marginBottom: 8, gap: 8 }}>
        <input 
          type="text" 
          value={node.nodeValue} 
          onChange={(e) => onUpdateNode(node, e.target.value)}
          style={{ flex: 1, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px' }}
        />
      </div>
    );
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const childNodes = Array.from(node.childNodes).filter(n => 
      n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== '')
    );
    const hasChildren = childNodes.length > 0;
    const isLeafElement = childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE;

    return (
      <div style={{ marginLeft: 20, marginBottom: 8, borderLeft: '1px solid var(--border)', paddingLeft: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-hover)', padding: '6px 8px', borderRadius: '4px' }}>
          {hasChildren && !isLeafElement && (
            <button 
              onClick={() => setExpanded(!expanded)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text3)' }}
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          <span style={{ fontWeight: '600', color: 'var(--blue)', fontSize: '13px' }}>&lt;{node.nodeName}&gt;</span>
          
          {/* If it's a leaf element, show input right here to save space */}
          {isLeafElement && (
             <input 
               type="text" 
               value={childNodes[0].nodeValue} 
               onChange={(e) => onUpdateNode(childNodes[0], e.target.value)}
               style={{ flex: 1, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '13px' }}
             />
          )}

          <div style={{ flex: 1 }}></div>
          {node.nodeName !== 'DeclarationsRS' && (
            <button 
              onClick={() => onDeleteNode(node)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: '2px 4px' }}
              title="Supprimer ce nœud"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {expanded && !isLeafElement && childNodes.map((child, i) => (
          <XmlNodeEditor 
            key={`${child.nodeName}-${i}`} 
            node={child} 
            path={`${path}/${i}`} 
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        ))}

        {!isLeafElement && expanded && hasChildren && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 8px' }}>
             <span style={{ fontWeight: '600', color: 'var(--text3)', fontSize: '13px' }}>&lt;/{node.nodeName}&gt;</span>
          </div>
        )}
      </div>
    )
  }

  return null;
}

export default function XmlEditorPage() {
  const [xmlDoc, setXmlDoc] = useState(null)
  const [xmlString, setXmlString] = useState('')
  const [status, setStatus] = useState(null)
  const fileInputRef = useRef()

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const text = evt.target.result
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, "text/xml")
        
        const parseError = doc.querySelector("parsererror")
        if (parseError) {
          throw new Error("Fichier XML invalide")
        }

        setXmlDoc(doc)
        setXmlString(text)
        setStatus({ type: 'success', msg: 'XML chargé avec succès.' })
      } catch (err) {
        setStatus({ type: 'error', msg: 'Erreur lors de la lecture du fichier XML.' })
      }
    }
    reader.readAsText(file)
  }

  const handleUpdateNode = (node, newValue) => {
    node.nodeValue = newValue;
    updateXmlString();
  }

  const handleDeleteNode = (node) => {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
      updateXmlString();
    }
  }

  const updateXmlString = () => {
    if (!xmlDoc) return;
    const serializer = new XMLSerializer();
    let str = serializer.serializeToString(xmlDoc);
    
    // Add XML declaration if missing
    if (!str.startsWith('<?xml')) {
      str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + str;
    }
    setXmlString(str);
  }

  const downloadModifiedXml = () => {
    if (!xmlString) return
    const blob = new Blob([xmlString], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `RS_modifie_${Date.now()}.xml`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>Éditeur XML Avancé</h1>
      <p style={{ color: 'var(--text2)' }}>
        Modifiez les fichiers XML générés pour corriger des montants ou informations avant le dépôt.
      </p>

      {status && (
        <div style={{
          padding: '12px 16px', borderRadius: '8px', 
          backgroundColor: status.type === 'error' ? 'var(--red-soft)' : 'var(--teal-soft)',
          color: status.type === 'error' ? 'var(--red)' : 'var(--teal)',
          border: `1px solid ${status.type === 'error' ? 'var(--red)' : 'var(--teal)'}`
        }}>
          {status.msg}
        </div>
      )}

      <Panel title="Importation & Outils">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="file" 
            accept=".xml" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            style={{ display: 'none' }} 
          />
          <button 
             onClick={() => fileInputRef.current.click()}
             style={{ 
               padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
               background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer',
               fontWeight: '600'
             }}
          >
            <Upload size={18} /> Importer un fichier XML
          </button>

          {xmlDoc && (
            <button 
              onClick={downloadModifiedXml}
              style={{ 
                padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--amber)', color: 'white', border: 'none', cursor: 'pointer',
                fontWeight: '600', marginLeft: 'auto'
              }}
            >
              <Download size={18} /> Télécharger le XML corrigé
            </button>
          )}
        </div>
      </Panel>

      {xmlDoc && (
        <Panel title="Modification visuelle du contenu">
           <div style={{ 
             maxHeight: '600px', overflowY: 'auto', 
             background: 'var(--surface)', padding: '16px', 
             borderRadius: '8px', border: '1px solid var(--border)',
             fontFamily: 'var(--mono)'
           }}>
             {Array.from(xmlDoc.childNodes).map((node, i) => (
                <XmlNodeEditor 
                  key={i} 
                  node={node} 
                  path={String(i)} 
                  onUpdateNode={handleUpdateNode}
                  onDeleteNode={handleDeleteNode}
                />
             ))}
           </div>
        </Panel>
      )}
    </div>
  )
}
