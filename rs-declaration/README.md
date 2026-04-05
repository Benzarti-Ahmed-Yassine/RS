# 🇹🇳 RS Declaration Generator

**Décodeur de factures → XML Retenue à la Source (DGI Tunisie)**

Analyse automatiquement une facture (image/PDF) grâce à **Google Gemini (IA)** et génère le fichier XML conforme pour la déclaration de Retenue à la Source tunisienne — avec support des **multi-taux TVA** (une `<Operation>` par groupe TVA).

---

## ✨ Fonctionnalités

- 📸 **Upload facture** (PNG, JPG, PDF)
- 🧠 **Extraction Intelligente** via Gemini Vision API (numéro, date, fournisseur, client, lignes, totaux)
- 🔀 **Multi-taux TVA** : groupement automatique des lignes par taux → plusieurs `<Operation>` XML
- 🗂️ **Tous les types RS** : RS1 → RS11 avec leurs désignations officielles DGI
- ✏️ **Édition manuelle** de tous les champs avant génération
- 📥 **Téléchargement XML** prêt à importer dans le portail DGI
- 🛠️ **Éditeur XML intégré** : Modifiez visuellement (via formulaire) vos fichiers existants post-génération.
- ✨ **Interface Premium animée** : Design UI ultra clair, layout Top Navigation et animations avec `framer-motion`.

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/rs-declaration.git
cd rs-declaration
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la clé API Gemini

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé API Google Gemini :

```
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Obtenir une clé API gratuite** : [Google AI Studio](https://aistudio.google.com/app/apikey)  
> Le modèle suggéré pour l'extraction de factures est `gemini-1.5-pro` ou `gemini-1.5-flash` pour leur rapidité et leur support vision étendu.

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Architecture et Vues

L'application est structurée en une *Single Page Application* (SPA) optimisée par **React et Vite** :

- 🏠 **Home** : Vue d'accueil avec animations interactives (Framer Motion).
- 📊 **Dashboard** : Centre de traitement où l'IA vérifie et extrait les données (`geminiService.js`), puis affiche les résultats via `TvaGroupsTable`.
- 🕰️ **History** : Audit et sauvegardes des déclarations.
- 📝 **Éditeur XML** : Vue dédiée pour charger, lire et corriger directement via un arbre dynamique UI les anciens fichiers XML générés.
- ⚙️ **Moteur XML** : Le script métier (`tvaGrouper.js` puis `xmlGenerator.js`) qui s'assure de l'exactitude comptable et génère le fichier final pour la DGI.

> ⚠️ **Important en production** : Ne jamais exposer la clé API côté client dans un déploiement public. Pour un déploiement sécurisé, implémentez un backend (par exemple un serveur Node.js/Express) qui agit en proxy vers l'API Gemini.

---

## 📁 Structure du projet

```text
rs-declaration/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # En-tête de l'app
│   │   ├── ApiKeyModal.jsx      # Modal saisie clé API
│   │   ├── UploadZone.jsx       # Zone upload facture
│   │   ├── DeclarantForm.jsx    # Formulaire déclarant + bénéficiaire
│   │   ├── RsTypeSelector.jsx   # Sélecteur type RS
│   │   ├── TvaGroupsTable.jsx   # Groupes TVA éditables
│   │   └── XmlOutput.jsx        # Affichage + téléchargement XML
│   ├── hooks/
│   │   └── useInvoiceAnalyzer.js  # Hook principal : appel Gemini + état
│   ├── pages/                   # Vues principales de l'application
│   │   ├── Home.jsx             # Page d'accueil (animée)
│   │   ├── Dashboard.jsx        # Dashboard d'analyse
│   │   ├── XmlEditorPage.jsx    # Extension: Éditeur XML post-génération
│   │   └── HistoryPage.jsx      # Historique
│   ├── utils/
│   │   ├── geminiService.js     # Appel API Google Generative AI (Vision)
│   │   ├── xmlGenerator.js      # Génération XML RS
│   │   └── tvaGrouper.js        # Groupement lignes par TVA
│   ├── App.jsx                  # Configuration globale et React Router
│   ├── main.jsx                 # Point d'entrée de l'application
│   └── index.css                # Styles globaux
├── .env.example
└── README.md                    # Ce fichier d'instructions
```

---

## 🔑 Comment fonctionne l'extraction

1. L'utilisateur importe sa facture (image PNG/JPG ou première page PDF) qui est convertie en **base64**.
2. Les données sont envoyées à l'API **Google Gemini** avec un prompt structuré dictant le format final.
3. L'intelligence artificielle extrait : les données du fournisseur, les dates, les totaux, chaque ligne de produit (quantité, PU HT, taux de TVA pertinent). Elle nettoie ou signale les anomalies détectées.
4. Les lignes traitées transitent vers le module de **groupement TVA** (formatage en une balise `<Operation>` par groupe).
5. Les montants finaux sont formatés en **millimes** (×1000) et le XML est instancié selon le schéma de la DGI.

---

## 📋 Format XML généré

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<DeclarationsRS VersionSchema="1.0">
  <Declarant>...</Declarant>
  <ReferenceDeclaration>...</ReferenceDeclaration>
  <AjouterCertificats>
    <Certificat>
      <Beneficiaire>...</Beneficiaire>
      <ListeOperations>
        <Operation IdTypeOperation="RS7_000001">
          <TauxTVA>0</TauxTVA>
          ...
        </Operation>
        <Operation IdTypeOperation="RS7_000001">
          <TauxTVA>19</TauxTVA>
          ...
        </Operation>
      </ListeOperations>
      <TotalPayement>...</TotalPayement>
    </Certificat>
  </AjouterCertificats>
</DeclarationsRS>
```

---

## 📄 Licence

MIT — Projet open source, contributions bienvenues.
