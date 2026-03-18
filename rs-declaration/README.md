# 🇹🇳 RS Declaration Generator

**Décodeur de factures → XML Retenue à la Source (DGI Tunisie)**

Analyse automatiquement une facture (image/PDF) via Claude AI et génère le fichier XML conforme pour la déclaration de Retenue à la Source tunisienne — avec support des **multi-taux TVA** (une `<Operation>` par groupe TVA).

---

## ✨ Fonctionnalités

- 📸 **Upload facture** (PNG, JPG, PDF)
- 🤖 **Extraction automatique** via Claude Vision API (numéro, date, fournisseur, client, lignes, totaux)
- 🔀 **Multi-taux TVA** : groupement automatique des lignes par taux → plusieurs `<Operation>` XML
- 🗂️ **Tous les types RS** : RS1 → RS11 avec leurs désignations officielles DGI
- ✏️ **Édition manuelle** de tous les champs avant génération
- 📥 **Téléchargement XML** prêt à importer dans le portail DGI

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

### 3. Configurer la clé API

```bash
cp .env.example .env
```

Éditez `.env` et ajoutez votre clé Anthropic :

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
```

> **Obtenir une clé API** : [https://console.anthropic.com/](https://console.anthropic.com/)  
> Le modèle utilisé est `claude-opus-4-5` (vision). Vérifiez que votre compte a accès à ce modèle.

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build pour production

```bash
npm run build
```

> ⚠️ **Important en production** : Ne jamais exposer la clé API côté client dans un déploiement public.  
> Pour un déploiement sécurisé, créez un backend Express/FastAPI qui fait le proxy vers l'API Anthropic.

---

## 📁 Structure du projet

```
rs-declaration/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # En-tête de l'app
│   │   ├── ApiKeyModal.jsx      # Modal saisie clé API
│   │   ├── UploadZone.jsx       # Zone upload facture
│   │   ├── DeclarantForm.jsx    # Formulaire déclarant + bénéficiaire
│   │   ├── RsTypeSelector.jsx   # Sélecteur type opération RS
│   │   ├── ExtractedTable.jsx   # Tableau lignes extraites
│   │   ├── TvaGroupsTable.jsx   # Groupes TVA éditables
│   │   └── XmlOutput.jsx        # Affichage + téléchargement XML
│   ├── hooks/
│   │   └── useInvoiceAnalyzer.js  # Hook principal : analyse + state
│   ├── utils/
│   │   ├── anthropicClient.js   # Appel API Anthropic (Vision)
│   │   ├── xmlGenerator.js      # Génération XML RS
│   │   └── tvaGrouper.js        # Groupement lignes par TVA
│   ├── data/
│   │   └── rsTypes.js           # Base de données types RS (RS1-RS11)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔑 Comment fonctionne l'extraction

1. La facture (image ou première page PDF) est convertie en **base64**
2. Envoi à l'API **Claude Vision** (`claude-opus-4-5`) avec un prompt structuré
3. Claude extrait : numéro facture, date, coordonnées fournisseur/client, chaque ligne (libellé, quantité, PU HT, PT HT, TVA%, Total TTC), et les totaux
4. Les lignes sont **groupées par taux TVA** → une `<Operation>` XML par groupe
5. Les montants XML sont en **millimes** (×1000) conformément au format DGI

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
        <!-- Une Operation par groupe TVA -->
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
