import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req, res) => {
  const startups = await prisma.startup.findMany({
    include: { user: { select: { id: true, name: true } } },
  })
  res.json(startups)
})

router.get('/me', authMiddleware, async (req, res) => {
  const startup = await prisma.startup.findUnique({
    where: { userId: req.userId },
    include: { user: { select: { id: true, name: true } } },
  })
  if (!startup) return res.status(404).json({ message: 'Not found' })
  res.json(startup)
})

router.get('/:id', async (req, res) => {
  const startup = await prisma.startup.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { id: true, name: true } } },
  })
  if (!startup) return res.status(404).json({ message: 'Not found' })
  res.json(startup)
})

const ALLOWED_FIELDS = [
  'startupName', 'founderName', 'sector', 'stage', 'fundingSought',
  'pitch', 'location', 'description', 'traction', 'useOfFunds', 'documents', 'foundedAt',
]

router.patch('/:id', authMiddleware, async (req, res) => {
  const startup = await prisma.startup.findUnique({ where: { id: req.params.id } })
  if (!startup || startup.userId !== req.userId) return res.status(404).json({ message: 'Not found' })
  const data = {}
  for (const key of ALLOWED_FIELDS) {
    if (req.body[key] !== undefined) data[key] = req.body[key]
  }
  const updated = await prisma.startup.update({
    where: { id: req.params.id },
    data,
  })
  res.json(updated)
})

export default router
