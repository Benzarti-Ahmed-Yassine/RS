import { useState, useEffect, useCallback } from 'react'

export function useHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('rs_declaration_history')
    if (saved) {
      try { setHistory(JSON.parse(saved)) } catch (e) { }
    }
  }, [])

  const addRecord = useCallback((newRecord) => {
    setHistory(prev => {
      const updated = [newRecord, ...prev].slice(0, 50)
      localStorage.setItem('rs_declaration_history', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('rs_declaration_history')
  }, [])
  
  const downloadXML = useCallback((item) => {
    const blob = new Blob([item.xml], { type: 'application/xml' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `declaration_RS_${item.factureNum || 'export'}.xml`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [])

  return { history, addRecord, clearHistory, downloadXML }
}
