#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# setup-github.sh  —  Initialize git and push to GitHub in one shot
# Usage:
#   chmod +x setup-github.sh
#   ./setup-github.sh https://github.com/VOTRE_USERNAME/rs-declaration.git
# ─────────────────────────────────────────────────────────────────────────────

REPO_URL=$1

if [ -z "$REPO_URL" ]; then
  echo "❌ Usage: ./setup-github.sh https://github.com/USERNAME/REPO.git"
  exit 1
fi

echo "🔧 Initializing git..."
git init
git add .
git commit -m "feat: initial commit — RS Declaration Generator v1.0

- Invoice image/PDF upload with drag & drop
- Claude Vision API extraction (fournisseur, client, lignes, totaux)
- Multi-TVA rate grouping → multiple <Operation> XML blocks
- Full RS1-RS11 type selector with official DGI designations
- Editable Declarant / Beneficiaire forms (auto-filled from invoice)
- XML download with syntax highlighting
- API key managed via localStorage (never committed)
- Vite + React 18 + CSS Modules"

echo "🔗 Adding remote: $REPO_URL"
git remote add origin "$REPO_URL"

echo "🚀 Pushing to main..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Your project is live at: $REPO_URL"
echo ""
echo "Next steps:"
echo "  1. cd rs-declaration"
echo "  2. cp .env.example .env"
echo "  3. Add your Anthropic API key to .env"
echo "  4. npm install && npm run dev"
