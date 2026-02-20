import { Router } from 'express'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { explainMatch } from '../utils/mlMatchingEngine.js'

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
 * POST /api/match-score/explain
 * Get detailed match explanation with contributions breakdown
 */
router.post('/explain', async (req, res) => {
  try {
    const { startup, investor } = req.body || {}
    if (!startup || !investor) {
      return res.status(400).json({ error: 'Request body must include startup and investor objects' })
    }

    const explanation = await explainMatch(startup, investor)
    res.json(explanation)
  } catch (e) {
    console.error('Match explanation error:', e)
    res.status(500).json({ error: e.message || 'Failed to explain match' })
  }
})

export default router
