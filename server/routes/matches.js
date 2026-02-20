import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { rankInvestorsForStartupML, rankStartupsForInvestorML } from '../utils/mlMatchingEngine.js'
import { rankInvestorsForStartup, rankStartupsForInvestor } from '../utils/matchingEngine.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sector, stage, ticketMin, ticketMax, useML = 'true' } = req.query
    const userId = req.userId
    const role = req.role
    const useMLRanking = useML === 'true' || useML === true

    if (role === 'startup') {
      const startup = await prisma.startup.findUnique({
        where: { userId },
        include: { user: { select: { name: true } } },
      })
      if (!startup) return res.json({ matches: [] })

      let investors = await prisma.investor.findMany({
        include: { user: { select: { id: true, name: true } } },
      })
      if (sector) investors = investors.filter((i) => !i.preferredSectors?.length || i.preferredSectors.includes(sector))
      if (stage) investors = investors.filter((i) => !i.preferredStages?.length || i.preferredStages.includes(stage))
      if (ticketMin != null) investors = investors.filter((i) => i.ticketMax >= Number(ticketMin))
      if (ticketMax != null) investors = investors.filter((i) => i.ticketMin <= Number(ticketMax))

      // Use ML ranking if enabled, otherwise fallback
      const ranked = useMLRanking 
        ? await rankInvestorsForStartupML(startup, investors)
        : rankInvestorsForStartup(startup, investors)

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
        scoreSource: inv.scoreSource || 'simple',
      }))
      return res.json({ matches, rankingMethod: useMLRanking ? 'ml' : 'simple' })
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

      // Use ML ranking if enabled
      const ranked = useMLRanking
        ? await rankStartupsForInvestorML(investor, startups)
        : rankStartupsForInvestor(investor, startups)

      const matches = ranked.map((s) => ({
        id: s.id,
        userId: s.userId,
        startupName: s.startupName,
        founderName: s.founderName,
        sector: s.sector,
        stage: s.stage,
        fundingSought: s.fundingSought,
        pitch: s.pitch,
        pitchDeckUrl: s.pitchDeckUrl,
        matchScore: s.matchScore,
        scoreSource: s.scoreSource || 'simple',
      }))
      return res.json({ matches, rankingMethod: useMLRanking ? 'ml' : 'simple' })
    }

    res.json({ matches: [] })
  } catch (e) {
    console.error('Matches route error:', e)
    res.status(500).json({ message: 'Failed to fetch matches' })
  }
})

export default router
