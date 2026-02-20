import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { rankInvestorsForStartupML, rankStartupsForInvestorML } from '../utils/mlMatchingEngine.js'
import { rankInvestorsForStartup, rankStartupsForInvestor } from '../utils/matchingEngine.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sector, stage, ticketMin, ticketMax, useML = 'true', page = '1', pageSize = '9' } = req.query
    const userId = req.userId
    const role = req.role
    const useMLRanking = useML === 'true' || useML === true

    const currentPage = Math.max(1, parseInt(page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(pageSize) || 9))

    if (role === 'startup') {
      const startup = await prisma.startup.findUnique({
        where: { userId },
        include: { user: { select: { name: true } } },
      })
      if (!startup) return res.json({ matches: [], totalCount: 0, totalPages: 0, page: currentPage, pageSize: limit, hasMore: false })

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

      const totalCount = ranked.length
      const totalPages = Math.ceil(totalCount / limit)
      const offset = (currentPage - 1) * limit
      const paginated = ranked.slice(offset, offset + limit)

      const matches = paginated.map((inv) => ({
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
      return res.json({
        matches,
        rankingMethod: useMLRanking ? 'ml' : 'simple',
        page: currentPage,
        pageSize: limit,
        totalCount,
        totalPages,
        hasMore: currentPage < totalPages,
      })
    }

    if (role === 'investor') {
      const investor = await prisma.investor.findUnique({
        where: { userId },
      })
      if (!investor) return res.json({ matches: [], totalCount: 0, totalPages: 0, page: currentPage, pageSize: limit, hasMore: false })

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

      const totalCount = ranked.length
      const totalPages = Math.ceil(totalCount / limit)
      const offset = (currentPage - 1) * limit
      const paginated = ranked.slice(offset, offset + limit)

      const matches = paginated.map((s) => ({
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
      return res.json({
        matches,
        rankingMethod: useMLRanking ? 'ml' : 'simple',
        page: currentPage,
        pageSize: limit,
        totalCount,
        totalPages,
        hasMore: currentPage < totalPages,
      })
    }

    res.json({ matches: [], totalCount: 0, totalPages: 0, page: currentPage, pageSize: limit, hasMore: false })
  } catch (e) {
    console.error('Matches route error:', e)
    res.status(500).json({ message: 'Failed to fetch matches' })
  }
})

export default router
