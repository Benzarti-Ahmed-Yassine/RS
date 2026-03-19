import { NavLink, Outlet } from 'react-router-dom'
import { FileText, LayoutDashboard, History, Settings, Home } from 'lucide-react'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      {/* Background grid */}
      <div className={styles.gridBg} aria-hidden />

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <FileText size={22} />
          </div>
          <div>
            <h1 className={styles.title}>RS<span>Decl</span></h1>
          </div>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            <Home size={18} /> Accueil
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            <LayoutDashboard size={18} /> Tableau de Bord
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            <History size={18} /> Historique
          </NavLink>
        </nav>

        <div className={styles.footer}>
          <button className={styles.link} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Settings size={18} /> Paramètres
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}
