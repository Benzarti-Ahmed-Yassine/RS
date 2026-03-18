/**
 * anthropicClient.js
 *
 * Sends an invoice image to Claude Vision and returns structured JSON data.
 *
 * HOW IT WORKS OUTSIDE CLAUDE.AI:
 * ─────────────────────────────────
 * In Claude.ai artifacts, the API proxy is handled automatically.
 * In your own app (GitHub / local), you provide your own API key via .env:
 *
 *   VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
 *
 * The request goes directly from the browser to api.anthropic.com.
 * The header `anthropic-dangerous-direct-browser-access: true` is required
 * by Anthropic to allow direct browser calls (use only in dev/trusted envs).
 *
 * For a SECURE production deployment, replace this with a call to your own
 * backend endpoint (Express, FastAPI, etc.) that holds the key server-side.
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-opus-4-5-20251101'
const API_KEY = ''
const EXTRACTION_PROMPT = `Tu es un expert comptable tunisien spécialisé dans l'analyse de factures.
Analyse cette facture et extrais TOUTES les données en JSON uniquement — aucun texte avant ou après, aucun bloc markdown.

Retourne EXACTEMENT ce format JSON:
{
  "facture_num": "string",
  "date": "DD/MM/YYYY",
  "fournisseur": {
    "nom": "string",
    "adresse": "string",
    "tel": "string",
    "email": "string",
    "identifiant": "string ou null"
  },
  "client": {
    "nom": "string",
    "adresse": "string",
    "identifiant": "string ou null"
  },
  "lignes": [
    {
      "libelle": "string",
      "quantite": 0.0,
      "unite": "string",
      "pu_ht": 0.0,
      "pt_ht": 0.0,
      "tva_pct": 0,
      "total_ttc": 0.0
    }
  ],
  "total_ht": 0.0,
  "total_tva": 0.0,
  "timbre_fiscal": 0.0,
  "total_ttc": 0.0
}

Règles importantes:
- tva_pct doit être un nombre entier (0, 7, 13, 19) — si la colonne TVA est vide, mets 0
- tous les montants sont en dinars tunisiens (DT), garde les décimales
- si une information est absente de la facture, mets null ou une chaîne vide
- ne jamais inventer des données qui ne sont pas dans la facture`

export async function extractInvoiceData(base64Image, mimeType, apiKey) {
  const key = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!key || key === 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx') {
    throw new Error('API_KEY_MISSING')
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    if (response.status === 401) throw new Error('API_KEY_INVALID')
    if (response.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(err?.error?.message || `HTTP ${response.status}`)
  }

  const data = await response.json()
  const text = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')

  // Strip any accidental markdown fences
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('PARSE_ERROR: ' + clean.slice(0, 200))
  }
}