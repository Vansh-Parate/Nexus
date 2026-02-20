import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { authMiddleware } from '../middleware/authMiddleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()
const router = Router()

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.pdf').toLowerCase()
    const safe = ext === '.pdf' ? ext : '.pdf'
    cb(null, `pitch-${Date.now()}-${Math.random().toString(36).slice(2, 9)}${safe}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /\.pdf$/i.test(file.originalname) || file.mimetype === 'application/pdf'
    if (ok) cb(null, true)
    else cb(new Error('Only PDF files are allowed'))
  },
})

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

router.post('/me/pitch-deck', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const startup = await prisma.startup.findUnique({ where: { userId: req.userId } })
    if (!startup) return res.status(404).json({ message: 'Not found' })
    const pitchDeckUrl = `/api/uploads/${req.file.filename}`
    await prisma.startup.update({
      where: { id: startup.id },
      data: { pitchDeckUrl },
    })
    res.json({ pitchDeckUrl })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e?.message || 'Upload failed' })
  }
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
  'pitch', 'location', 'description', 'traction', 'useOfFunds', 'documents', 'foundedAt', 'profileCompletedAt',
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
