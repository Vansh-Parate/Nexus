import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { computeMatchScore } from '../utils/matchingEngine.js'
import { rankInvestorsForStartupML, rankStartupsForInvestorML } from '../utils/mlMatchingEngine.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

/**
 * GET /api/dashboard
 * Returns a complete dashboard payload for the logged-in startup or investor.
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.userId
        const role = req.role

        if (role === 'startup') {
            return handleStartupDashboard(userId, res)
        }
        if (role === 'investor') {
            return handleInvestorDashboard(userId, res)
        }
        res.status(400).json({ message: 'Unknown role' })
    } catch (e) {
        console.error('Dashboard error:', e)
        res.status(500).json({ message: 'Failed to load dashboard' })
    }
})

async function handleStartupDashboard(userId, res) {
    // 1. Fetch startup with user
    const startup = await prisma.startup.findUnique({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
    })
    if (!startup) return res.status(404).json({ message: 'Startup profile not found' })

    // 2. Fetch all investors and compute matches using ML ranking
    const investors = await prisma.investor.findMany({
        include: { user: { select: { id: true, name: true } } },
    })

    // Use ML-based ranking for intelligent sorting
    let matchedInvestors
    try {
        matchedInvestors = await rankInvestorsForStartupML(startup, investors)
        matchedInvestors = matchedInvestors
            .map((inv) => ({
                id: inv.id,
                userId: inv.userId,
                name: inv.user?.name ?? inv.fullName,
                firmName: inv.firmName,
                investorType: inv.investorType,
                preferredSectors: inv.preferredSectors,
                preferredStages: inv.preferredStages,
                ticketMin: inv.ticketMin,
                ticketMax: inv.ticketMax,
                thesis: inv.thesis,
                matchScore: inv.matchScore,
            }))
            .filter((inv) => inv.matchScore > 0)
    } catch (err) {
        // Fallback to simple scoring if ML fails
        console.warn('ML ranking failed, using fallback:', err.message)
        matchedInvestors = investors
            .map((inv) => ({
                id: inv.id,
                userId: inv.userId,
                name: inv.user?.name ?? inv.fullName,
                firmName: inv.firmName,
                investorType: inv.investorType,
                preferredSectors: inv.preferredSectors,
                preferredStages: inv.preferredStages,
                ticketMin: inv.ticketMin,
                ticketMax: inv.ticketMax,
                thesis: inv.thesis,
                matchScore: computeMatchScore(startup, inv),
            }))
            .filter((inv) => inv.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
    }

    const totalMatches = matchedInvestors.length
    const topMatchScore = matchedInvestors.length > 0 ? matchedInvestors[0].matchScore : 0
    const avgMatchScore =
        matchedInvestors.length > 0
            ? Math.round(matchedInvestors.reduce((s, i) => s + i.matchScore, 0) / matchedInvestors.length)
            : 0

    // Distribution: high (>=80), med (>=50), low (<50)
    const highCount = matchedInvestors.filter((i) => i.matchScore >= 80).length
    const medCount = matchedInvestors.filter((i) => i.matchScore >= 50 && i.matchScore < 80).length
    const lowCount = matchedInvestors.filter((i) => i.matchScore < 50).length
    const highPct = totalMatches > 0 ? Math.round((highCount / totalMatches) * 100) : 0
    const medPct = totalMatches > 0 ? Math.round((medCount / totalMatches) * 100) : 0
    const lowPct = totalMatches > 0 ? Math.round((lowCount / totalMatches) * 100) : 0

    // 3. Connection requests (for activity stats)
    const sentRequests = await prisma.connectionRequest.findMany({
        where: { fromStartupId: startup.id },
        include: {
            investorReceiver: { include: { user: { select: { name: true } } } },
        },
    })
    const receivedRequests = await prisma.connectionRequest.findMany({
        where: { toStartupId: startup.id },
        include: {
            investorSender: { include: { user: { select: { name: true } } } },
        },
    })

    const acceptedCount = [...sentRequests, ...receivedRequests].filter((r) => r.status === 'accepted').length
    const declinedCount = [...sentRequests, ...receivedRequests].filter((r) => r.status === 'declined').length
    const pendingCount = [...sentRequests, ...receivedRequests].filter((r) => r.status === 'pending').length

    // 4. Profile completeness
    const profileFields = [
        'startupName', 'founderName', 'sector', 'stage', 'fundingSought',
        'pitch', 'location', 'description', 'traction', 'useOfFunds', 'foundedAt',
    ]
    const filledFields = profileFields.filter((f) => {
        const val = startup[f]
        if (val === null || val === undefined) return false
        if (typeof val === 'string' && val.trim() === '') return false
        return true
    }).length
    const profileCompletion = Math.round((filledFields / profileFields.length) * 100)

    // 5. Readiness score (weighted profile completion + match availability)
    const readinessScore = Math.min(
        100,
        Math.round(profileCompletion * 0.6 + (totalMatches > 0 ? 30 : 0) + (startup.traction ? 10 : 0))
    )
    const readinessTier =
        readinessScore >= 80 ? 'Gold' : readinessScore >= 60 ? 'Silver' : 'Bronze'

    // 6. Missing profile fields for "Improve Score"
    const missingActions = []
    if (!startup.traction || (startup.traction && !startup.traction.revenue))
        missingActions.push({ label: 'Add revenue band to profile', points: '+8 pts', pointsValue: 8 })
    if (!startup.pitch)
        missingActions.push({ label: 'Upload pitch deck', points: '+12 pts', pointsValue: 12 })
    if (!startup.useOfFunds)
        missingActions.push({ label: 'Specify equity % offered', points: '+5 pts', pointsValue: 5 })
    if (!startup.description)
        missingActions.push({ label: 'Add detailed description', points: '+6 pts', pointsValue: 6 })
    if (!startup.foundedAt)
        missingActions.push({ label: 'Add founding date', points: '+4 pts', pointsValue: 4 })
    if (!startup.location)
        missingActions.push({ label: 'Add location information', points: '+5 pts', pointsValue: 5 })

    // 7. Traction data
    const traction = startup.traction || {}

    // 8. Benchmark: rank among same-sector startups
    const sameSectorStartups = await prisma.startup.findMany({
        where: { sector: startup.sector },
    })
    const sectStartupCount = sameSectorStartups.length
    // Rank by fundingSought (higher = better traction indicator) — simplified
    const sortedByFunding = [...sameSectorStartups].sort((a, b) => (b.fundingSought || 0) - (a.fundingSought || 0))
    const myRank = sortedByFunding.findIndex((s) => s.id === startup.id) + 1
    const topPercentile = sectStartupCount > 0 ? Math.round((myRank / sectStartupCount) * 100) : 50

    // 9. Format funding as a human string
    const fundingSought = startup.fundingSought || 0
    let fundingAsk = ''
    if (fundingSought >= 100) {
        const crMin = Math.floor(fundingSought / 100)
        const crMax = Math.ceil(fundingSought / 100) + 1
        fundingAsk = `₹${crMin}Cr – ₹${crMax}Cr`
    } else {
        fundingAsk = `₹${fundingSought}L`
    }

    res.json({
        startup: {
            id: startup.id,
            startupName: startup.startupName,
            founderName: startup.founderName,
            sector: startup.sector,
            stage: startup.stage,
            location: startup.location || 'Not specified',
            description: startup.description,
            pitch: startup.pitch,
            fundingSought: startup.fundingSought,
            fundingAsk,
            traction,
            useOfFunds: startup.useOfFunds,
            foundedAt: startup.foundedAt,
            avatar: startup.user?.avatar,
            userName: startup.user?.name,
        },
        matchSummary: {
            totalMatches,
            topMatchScore,
            avgMatchScore,
            distribution: { highPct, medPct, lowPct },
        },
        readiness: {
            score: readinessScore,
            tier: readinessTier,
            profileCompletion,
        },
        benchmark: {
            topPercentile,
            sector: startup.sector,
            totalInSector: sectStartupCount,
        },
        matches: matchedInvestors.slice(0, 12), // top 12
        missingActions,
        activity: {
            totalSent: sentRequests.length,
            totalReceived: receivedRequests.length,
            accepted: acceptedCount,
            declined: declinedCount,
            pending: pendingCount,
        },
    })
}

async function handleInvestorDashboard(userId, res) {
    const investor = await prisma.investor.findUnique({
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
    })
    if (!investor) return res.status(404).json({ message: 'Investor profile not found' })

    const startups = await prisma.startup.findMany({
        include: { user: { select: { id: true, name: true } } },
    })

    // Use ML-based ranking for intelligent sorting
    let matchedStartups
    try {
        matchedStartups = await rankStartupsForInvestorML(investor, startups)
        matchedStartups = matchedStartups
            .map((s) => ({
                ...s,
                matchScore: s.matchScore,
            }))
            .filter((s) => s.matchScore > 0)
    } catch (err) {
        // Fallback to simple scoring if ML fails
        console.warn('ML ranking failed for investor dashboard, using fallback:', err.message)
        matchedStartups = startups
            .map((s) => ({
                ...s,
                matchScore: computeMatchScore(s, investor),
            }))
            .filter((s) => s.matchScore > 0)
            .sort((a, b) => b.matchScore - a.matchScore)
    }

    res.json({
        investor,
        matches: matchedStartups.slice(0, 12),
        totalMatches: matchedStartups.length,
    })
}

export default router
