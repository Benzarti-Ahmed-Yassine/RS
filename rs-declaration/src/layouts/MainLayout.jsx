import { NavLink, Outlet } from 'react-router-dom'
import { FileText, LayoutDashboard, History, Home, FileCode2 } from 'lucide-react'
import { motion } from 'framer-motion'
import styles from './MainLayout.module.css'

export default function MainLayout() {
  return (
    <div className={styles.layout}>
      {/* Background container */}
      <div className={styles.gridBg} aria-hidden />

      {/* Top Navigation */}
      <motion.header 
        className={styles.header}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <FileText size={22} />
            </div>
            <div>
              <h1 className={styles.title}>RS<span>Decl</span></h1>
            </div>
          </div>

          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <Home size={18} /> Accueil
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <LayoutDashboard size={18} /> Tableau de Bord
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <History size={18} /> Historique
            </NavLink>
            <NavLink to="/editor" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <FileCode2 size={18} /> Éditeur XML
            </NavLink>
          </nav>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}
