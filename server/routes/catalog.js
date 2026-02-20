import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

router.get('/startups', async (req, res) => {
  try {
    const list = await prisma.startupCatalog.findMany({
      orderBy: { startupId: 'asc' },
    })
    res.json({ startups: list })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to fetch startups' })
  }
})

router.get('/investors', async (req, res) => {
  try {
    const list = await prisma.investorCatalog.findMany({
      orderBy: { investorId: 'asc' },
    })
    res.json({ investors: list })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to fetch investors' })
  }
})

export default router
