import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req, res) => {
  const investors = await prisma.investor.findMany({
    include: { user: { select: { id: true, name: true } } },
  })
  res.json(investors)
})

router.get('/me', authMiddleware, async (req, res) => {
  const investor = await prisma.investor.findUnique({
    where: { userId: req.userId },
    include: { user: { select: { id: true, name: true } } },
  })
  if (!investor) return res.status(404).json({ message: 'Not found' })
  res.json(investor)
})

router.get('/:id', async (req, res) => {
  const investor = await prisma.investor.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { id: true, name: true } } },
  })
  if (!investor) return res.status(404).json({ message: 'Not found' })
  res.json(investor)
})

const ALLOWED_FIELDS = [
  'fullName', 'firmName', 'investorType', 'preferredSectors', 'ticketMin', 'ticketMax',
  'preferredStages', 'portfolioSize', 'thesis',
]

router.patch('/:id', authMiddleware, async (req, res) => {
  const investor = await prisma.investor.findUnique({ where: { id: req.params.id } })
  if (!investor || investor.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const data = {}
  for (const key of ALLOWED_FIELDS) {
    if (req.body[key] !== undefined) data[key] = req.body[key]
  }
  const updated = await prisma.investor.update({
    where: { id: req.params.id },
    data,
  })
  res.json(updated)
})

export default router
