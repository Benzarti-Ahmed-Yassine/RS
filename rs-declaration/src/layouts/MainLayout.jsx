import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, History, Home, FileCode2 } from 'lucide-react'
import { motion } from 'framer-motion'
const logoImage = '/t.png'
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
            <img src={logoImage} alt="TAYSIR Logo" className={styles.logoImg} />
            <div>
              <h1 className={styles.title}>TAY<span>SIR</span></h1>
            </div>
          </div>

          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <Home size={18} /> Accueil
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
              <LayoutDashboard size={18} /> <strong>TABLEAU DE BORD</strong>
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
