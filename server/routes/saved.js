import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

// List saved investors for the logged-in startup
router.get('/', async (req, res) => {
  try {
    const userId = req.userId
    const role = req.role

    if (role !== 'startup') {
      return res.json({ saved: [] })
    }

    const startup = await prisma.startup.findUnique({ where: { userId } })
    if (!startup) return res.json({ saved: [] })

    const saved = await prisma.savedInvestor.findMany({
      where: { startupId: startup.id },
      include: {
        investor: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const items = saved.map((s) => ({
      id: s.investor.id,
      userId: s.investor.userId,
      name: s.investor.user?.name ?? s.investor.fullName,
      firmName: s.investor.firmName,
      investorType: s.investor.investorType,
      preferredSectors: s.investor.preferredSectors,
      preferredStages: s.investor.preferredStages,
      ticketMin: s.investor.ticketMin,
      ticketMax: s.investor.ticketMax,
      savedAt: s.createdAt,
    }))

    res.json({ saved: items })
  } catch (e) {
    console.error('Saved investors list error:', e)
    res.status(500).json({ message: 'Failed to load saved investors' })
  }
})

// Save an investor for the logged-in startup
router.post('/:investorId', async (req, res) => {
  try {
    const userId = req.userId
    const role = req.role
    const { investorId } = req.params

    if (role !== 'startup') {
      return res.status(403).json({ message: 'Only startups can save investors' })
    }

    const startup = await prisma.startup.findUnique({ where: { userId } })
    if (!startup) return res.status(400).json({ message: 'Startup profile not found' })

    const investor = await prisma.investor.findUnique({ where: { id: investorId } })
    if (!investor) return res.status(404).json({ message: 'Investor not found' })

    await prisma.savedInvestor.upsert({
      where: { startupId_investorId: { startupId: startup.id, investorId } },
      update: {},
      create: { startupId: startup.id, investorId },
    })

    res.status(201).json({ ok: true })
  } catch (e) {
    console.error('Save investor error:', e)
    res.status(500).json({ message: 'Failed to save investor' })
  }
})

// Remove a saved investor
router.delete('/:investorId', async (req, res) => {
  try {
    const userId = req.userId
    const role = req.role
    const { investorId } = req.params

    if (role !== 'startup') {
      return res.status(403).json({ message: 'Only startups can unsave investors' })
    }

    const startup = await prisma.startup.findUnique({ where: { userId } })
    if (!startup) return res.status(400).json({ message: 'Startup profile not found' })

    await prisma.savedInvestor.deleteMany({
      where: { startupId: startup.id, investorId },
    })

    res.json({ ok: true })
  } catch (e) {
    console.error('Unsave investor error:', e)
    res.status(500).json({ message: 'Failed to unsave investor' })
  }
})

export default router

