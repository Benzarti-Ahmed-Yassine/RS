import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import HistoryPage from './pages/HistoryPage'
import XmlEditorPage from './pages/XmlEditorPage'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Redirect to home page on refresh if the current path is not the home page
    if (location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="editor" element={<XmlEditorPage />} />
      </Route>
    </Routes>
  )
}
