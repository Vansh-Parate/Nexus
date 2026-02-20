import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { rankInvestorsForStartup, rankStartupsForInvestor } from '../utils/matchingEngine.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sector, stage, ticketMin, ticketMax } = req.query
    const userId = req.userId
    const role = req.role

    if (role === 'startup') {
      const startup = await prisma.startup.findUnique({
        where: { userId },
        include: { user: { select: { name: true } } },
      })
      if (!startup) return res.json({ matches: [] })

      let investors = await prisma.investor.findMany({
        include: { user: { select: { id: true, name: true } } },
      })
      if (sector) investors = investors.filter((i) => i.preferredSectors.includes(sector))
      if (stage) investors = investors.filter((i) => i.preferredStages.includes(stage))
      if (ticketMin != null) investors = investors.filter((i) => i.ticketMax >= Number(ticketMin))
      if (ticketMax != null) investors = investors.filter((i) => i.ticketMin <= Number(ticketMax))

      const ranked = rankInvestorsForStartup(startup, investors)
      const matches = ranked.map((inv) => ({
        id: inv.id,
        userId: inv.userId,
        name: inv.user?.name ?? inv.fullName,
        firmName: inv.firmName,
        investorType: inv.investorType,
        preferredSectors: inv.preferredSectors,
        ticketMin: inv.ticketMin,
        ticketMax: inv.ticketMax,
        preferredStages: inv.preferredStages,
        matchScore: inv.matchScore,
      }))
      return res.json({ matches })
    }

    if (role === 'investor') {
      const investor = await prisma.investor.findUnique({
        where: { userId },
      })
      if (!investor) return res.json({ matches: [] })

      let startups = await prisma.startup.findMany({
        include: { user: { select: { id: true } } },
      })
      if (sector) startups = startups.filter((s) => s.sector === sector)
      if (stage) startups = startups.filter((s) => s.stage === stage)
      if (ticketMin != null) startups = startups.filter((s) => s.fundingSought >= Number(ticketMin))
      if (ticketMax != null) startups = startups.filter((s) => s.fundingSought <= Number(ticketMax))

      const ranked = rankStartupsForInvestor(investor, startups)
      const matches = ranked.map((s) => ({
        id: s.id,
        userId: s.userId,
        startupName: s.startupName,
        founderName: s.founderName,
        sector: s.sector,
        stage: s.stage,
        fundingSought: s.fundingSought,
        pitch: s.pitch,
        matchScore: s.matchScore,
      }))
      return res.json({ matches })
    }

    res.json({ matches: [] })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to fetch matches' })
  }
})

export default router
