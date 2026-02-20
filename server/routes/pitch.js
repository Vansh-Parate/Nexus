import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

/**
 * POST /api/pitch/generate
 * Uses Gemini to generate pitch and/or description from startup profile
 * Body: { type: 'pitch' | 'description' | 'both' }
 */
router.post('/generate', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(503).json({
        message: 'Pitch generation not configured. Add GEMINI_API_KEY to .env',
      })
    }

    const userId = req.userId
    const role = req.role
    if (role !== 'startup') {
      return res.status(403).json({ message: 'Only startups can generate pitch' })
    }

    const startup = await prisma.startup.findUnique({
      where: { userId },
    })
    if (!startup) return res.status(404).json({ message: 'Startup profile not found' })

    const { type = 'both' } = req.body || {}

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const profileSummary = [
      `Startup: ${startup.startupName || 'N/A'}`,
      `Founder: ${startup.founderName || 'N/A'}`,
      `Sector: ${startup.sector || 'N/A'}`,
      `Stage: ${startup.stage || 'N/A'}`,
      `Funding sought: ₹${startup.fundingSought || 0}L`,
      `Location: ${startup.location || 'N/A'}`,
      `Current description: ${startup.description || '(none)'}`,
      `Current pitch: ${startup.pitch || '(none)'}`,
      `Use of funds: ${startup.useOfFunds || '(none)'}`,
    ].join('\n')

    let pitchText = ''
    let descriptionText = ''

    if (type === 'pitch' || type === 'both') {
      const pitchPrompt = `You are a startup pitch coach for Indian startups. Based on this profile, write a concise one-liner pitch (1-2 sentences, max 200 chars) that investors will remember:

${profileSummary}

Return ONLY the pitch text, no quotes or labels.`
      const pitchResult = await model.generateContent(pitchPrompt)
      pitchText = pitchResult.response?.text?.()?.trim() || ''
    }

    if (type === 'description' || type === 'both') {
      const descPrompt = `You are a startup pitch coach for Indian startups. Based on this profile, write a short "About / Description" (2-4 sentences) that explains the problem, solution, and traction for investors:

${profileSummary}

Return ONLY the description text, no quotes or labels.`
      const descResult = await model.generateContent(descPrompt)
      descriptionText = descResult.response?.text?.()?.trim() || ''
    }

    res.json({
      pitch: type === 'description' ? undefined : pitchText,
      description: type === 'pitch' ? undefined : descriptionText,
    })
  } catch (e) {
    console.error('Pitch generation error:', e)
    res.status(500).json({
      message: e.message || 'Failed to generate pitch',
    })
  }
})

export default router
