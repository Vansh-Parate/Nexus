import { Router } from 'express'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { explainMatch } from '../utils/mlMatchingEngine.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const router = Router()

const PYTHON = process.env.PYTHON || 'python'
const SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'predict_score.py')
const EXPLAIN_SCRIPT_PATH = path.join(__dirname, '..', 'scripts', 'explain_match.py')

function toSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const snake = k.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase())
    out[snake] = v
  }
  return out
}

router.post('/', async (req, res) => {
  try {
    const { startup, investor } = req.body || {}
    if (!startup || !investor) {
      return res.status(400).json({ error: 'Request body must include startup and investor objects' })
    }

    const startupPayload = {
      industry: startup.industry ?? startup.preferred_industry,
      stage: startup.stage,
      funding_required: startup.funding_required ?? startup.fundingRequiredLakhs ?? startup.funding_required_lakhs,
      description: startup.description ?? '',
    }
    const investorPayload = {
      preferred_industry: investor.preferred_industry ?? investor.preferredIndustry,
      preferred_stage: investor.preferred_stage ?? investor.preferredStage,
      ticket_min: investor.ticket_min ?? investor.ticketMinLakhs ?? investor.ticket_min_lakhs,
      ticket_max: investor.ticket_max ?? investor.ticketMaxLakhs ?? investor.ticket_max_lakhs,
      description: investor.description ?? investor.thesis ?? '',
    }

    const input = JSON.stringify({ startup: startupPayload, investor: investorPayload })
    const proc = spawn(PYTHON, [SCRIPT_PATH], {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', (d) => { stdout += d.toString() })
    proc.stderr.on('data', (d) => { stderr += d.toString() })
    proc.stdin.write(input)
    proc.stdin.end()

    proc.on('close', (code) => {
      if (code !== 0) {
        try {
          const err = JSON.parse(stderr.trim())
          return res.status(503).json(err)
        } catch (_) {
          return res.status(503).json({ error: stderr || 'Model prediction failed' })
        }
      }
      try {
        const out = JSON.parse(stdout.trim())
        return res.json(out)
      } catch (_) {
        return res.status(500).json({ error: 'Invalid prediction output' })
      }
    })

    proc.on('error', (err) => {
      res.status(503).json({ error: 'Python not available', detail: err.message })
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to compute match score' })
  }
})

/**
 * Generate natural language explanation using Gemini
 */
async function generateNaturalLanguageExplanation(startup, investor, explanation) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return null // Fallback to rule-based if Gemini not configured
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const investorPrefs = Array.isArray(investor.preferredSectors) 
      ? investor.preferredSectors.join(', ')
      : investor.preferredSectors || 'Any'
    const investorStages = Array.isArray(investor.preferredStages)
      ? investor.preferredStages.join(', ')
      : investor.preferredStages || 'Any'

    const ticketMinFormatted = investor.ticketMin ? `₹${investor.ticketMin}L` : '₹0L'
    const ticketMaxFormatted = investor.ticketMax ? `₹${investor.ticketMax}L` : '₹1000L'
    const ticketRange = `${ticketMinFormatted}–${ticketMaxFormatted}`

    const prompt = `You are an AI matchmaking assistant for Indian startups and investors. Instead of a paragraph, return 4–6 short labeled lines explaining why this startup matches this investor's preferences.

Startup Details:
- Name: ${startup.startupName || 'N/A'}
- Sector: ${startup.sector || 'N/A'}
- Stage: ${startup.stage || 'N/A'}
- Funding sought: ₹${startup.fundingSought || 0}L
- Description: ${(startup.pitch || startup.description || '').substring(0, 200)}

Investor Preferences:
- Preferred sectors: ${investorPrefs}
- Preferred stages: ${investorStages}
- Investment ticket range: ${ticketRange}

Match Analysis:
- Sector alignment: ${explanation.contributions.sector.match ? '✓ Matches' : '✗ Does not match'} (Startup: ${explanation.contributions.sector.startup}, Investor prefers: ${explanation.contributions.sector.investor})
- Stage alignment: ${explanation.contributions.stage.match ? '✓ Matches' : '✗ Does not match'} (Startup: ${explanation.contributions.stage.startup}, Investor prefers: ${explanation.contributions.stage.investor})
- Funding fit: ${explanation.contributions.funding.fit ? '✓ Within range' : '✗ Outside range'} (Startup seeks ₹${explanation.contributions.funding.startup_ask}L, Investor range: ${ticketRange})
- Overall match score: ${explanation.score}%

Output format (very important):
- Each line must be a short label followed by a colon and a brief explanation.
- Use 4–6 lines maximum.
- Do NOT write a connected paragraph.

Recommended labels (use these exact labels where possible):
- Overall match:
- Sector alignment:
- Stage alignment:
- Funding fit:
- Idea & thesis fit:
- Action hint:

Guidelines:
1. Be concise and investor-focused.
2. Highlight concrete alignment points (sector, stage, funding range, thesis fit).
3. Use Indian currency format (₹X Lakhs or ₹X Crores) when mentioning money.
4. Avoid filler sentences or story-telling; keep it crisp and scannable.

Example style:
Overall match: Strong fit for your FinTech focus at Seed stage within your ₹50L–₹2Cr range.
Sector alignment: FinTech startup aligned with your FinTech and Payments thesis.
Stage alignment: Startup at Seed stage, matching your Pre-Seed to Series A focus.
Funding fit: Ask of ₹75L sits comfortably within your ₹50L–₹2Cr ticket range.
Idea & thesis fit: Clear revenue model and early traction consistent with your growth-oriented investments.

Return ONLY the labeled lines (no extra headings, quotes, or explanations).`

    const result = await model.generateContent(prompt)
    const text = result.response?.text?.()?.trim() || null
    return text
  } catch (err) {
    console.warn('Gemini explanation generation failed:', err.message)
    return null
  }
}

/**
 * POST /api/match-score/explain
 * Get detailed match explanation with contributions breakdown + natural language explanation
 */
router.post('/explain', async (req, res) => {
  try {
    const { startup, investor } = req.body || {}
    if (!startup || !investor) {
      return res.status(400).json({ error: 'Request body must include startup and investor objects' })
    }

    const explanation = await explainMatch(startup, investor)
    
    // Generate natural language explanation for investors
    const naturalExplanation = await generateNaturalLanguageExplanation(startup, investor, explanation)
    
    res.json({
      ...explanation,
      naturalExplanation: naturalExplanation || null,
    })
  } catch (e) {
    console.error('Match explanation error:', e)
    res.status(500).json({ error: e.message || 'Failed to explain match' })
  }
})

export default router
