import { useNavigate } from 'react-router-dom'
import { Zap, Shield, FileOutput, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import styles from './Home.module.css'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header className={styles.hero} variants={itemVariants}>
        <motion.div 
          className={styles.badge}
          whileHover={{ scale: 1.05 }}
        >
          Génération XML DGI 2026
        </motion.div>
        
        <h1 className={styles.title}>
          TAYSIR <br />
          <span>Votre assistant fiscal intelligent</span>
        </h1>
        
        <p className={styles.subtitle}>
          Uploadez vos factures tunisiennes (PDF ou Image) et laissez l'IA de Google 
          en extraire automatiquement les informations pour générer un fichier XML 
          conforme à la norme DGI.
        </p>
        
        <motion.button 
          className={styles.cta} 
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.05, boxShadow: "0px 8px 32px rgba(37,99,235,0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          Commencer l'analyse <ArrowRight size={18} />
        </motion.button>
      </motion.header>

      <motion.section className={styles.features} variants={containerVariants}>
        <motion.div 
          className={styles.card} 
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
        >
          <div className={styles.iconWrapper} style={{ color: 'var(--teal)' }}>
            <Zap size={24} />
          </div>
          <h3>Analyse Instantanée</h3>
          <p>Notre IA intelligente extrait automatiquement les dates, montants, fournisseurs et numéros de factures avec une haute précision, sans nécessiter de configuration ni de clés d'API (credentials).</p>
        </motion.div>
        
        <motion.div 
          className={styles.card} 
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
        >
          <div className={styles.iconWrapper} style={{ color: 'var(--amber)' }}>
            <FileOutput size={24} />
          </div>
          <h3>Génération XML Native</h3>
          <p>Exportez directement vos groupes TVA dans un fichier XML formaté selon les stricts standards de la DGI tunisienne.</p>
        </motion.div>
        
        <motion.div 
          className={styles.card} 
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: "0 15px 30px -5px rgba(0,0,0,0.1)" }}
        >
          <div className={styles.iconWrapper} style={{ color: 'var(--blue)' }}>
            <Shield size={24} />
          </div>
          <h3>Confidentialité & Sécurité</h3>
          <p>Vos données et l'historique restent localisés dans votre navigateur en toute sécurité.</p>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
