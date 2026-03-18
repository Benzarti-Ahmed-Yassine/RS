/**
 * anthropicClient.js -> Now migrated to Google Gemini API (Free Tier)
 * 
 * We kept the same filename to avoid breaking your imports,
 * but this now uses Gemini 1.5 Flash which has a generous free tier!
 *
 * Requirements:
 * 1. Get a free API key at: https://aistudio.google.com/
 * 2. Put it in your .env as VITE_GEMINI_API_KEY=AIzaSy...
 */

const MODEL_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='

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

export async function extractInvoiceData(base64Image, mimeType) {
  // Use the environment variable directly (UI config removed)
  const key = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY
  
  if (!key || key.includes('xxxxxxxxxxx')) {
    throw new Error('API_KEY_MISSING')
  }

  const response = await fetch(`${MODEL_ENDPOINT}${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: EXTRACTION_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Gemini API Error:", errorData);
    if (response.status === 400 && errorData?.error?.message?.includes('API key not valid')) {
      throw new Error('API_KEY_INVALID');
    }
    throw new Error(errorData?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('PARSE_ERROR: No response from Gemini');
  }

  const text = data.candidates[0].content.parts[0].text;
  const clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error('PARSE_ERROR: ' + clean.slice(0, 200));
  }
}