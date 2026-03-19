import { useNavigate } from 'react-router-dom'
import { Zap, Shield, FileOutput, ArrowRight } from 'lucide-react'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.badge}>Génération XML DGI 2026</div>
        <h1 className={styles.title}>
          Déclaration Retenue à la Source <br />
          <span>Automatisée par IA</span>
        </h1>
        <p className={styles.subtitle}>
          Uploadez vos factures tunisiennes (PDF ou Image) et laissez l'IA de Google 
          en extraire automatiquement les informations pour générer un fichier XML 
          conforme à la norme DGI.
        </p>
        <button className={styles.cta} onClick={() => navigate('/dashboard')}>
          Commencer l'analyse <ArrowRight size={18} />
        </button>
      </header>

      <section className={styles.features}>
        <div className={styles.card}>
          <div className={styles.iconWrapper} style={{ color: 'var(--teal)' }}>
            <Zap size={24} />
          </div>
          <h3>Analyse Instantanée</h3>
          <p>L'IA de Gemini extrait dates, montants, fournisseurs et numéros de factures en quelques secondes avec une très haute précision.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper} style={{ color: 'var(--amber)' }}>
            <FileOutput size={24} />
          </div>
          <h3>Génération XML Native</h3>
          <p>Exportez directement vos groupes TVA dans un fichier XML formaté selon les stricts standards de la DGI tunisienne.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconWrapper} style={{ color: 'var(--blue)' }}>
            <Shield size={24} />
          </div>
          <h3>Confidentialité & Sécurité</h3>
          <p>Vos données et l'historique restent localisés dans votre navigateur en toute sécurité.</p>
        </div>
      </section>
    </div>
  )
}
