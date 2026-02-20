import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { sendPitchEmail } from '../utils/mailer.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

router.get('/', async (req, res) => {
  const userId = req.userId
  const role = req.role

  const startup = await prisma.startup.findUnique({ where: { userId } })
  const investor = await prisma.investor.findUnique({ where: { userId } })
  const fromId = role === 'startup' ? startup?.id : investor?.id
  const toId = role === 'startup' ? startup?.id : investor?.id

  const sent = fromId
    ? await prisma.connectionRequest.findMany({
        where: role === 'startup' ? { fromStartupId: fromId } : { fromInvestorId: fromId },
        include: { startupReceiver: true, investorReceiver: true },
      })
    : []
  const received = toId
    ? await prisma.connectionRequest.findMany({
        where: role === 'startup' ? { toStartupId: toId } : { toInvestorId: toId },
        include: { startupSender: true, investorSender: true },
      })
    : []

  res.json({ sent, received, accepted: [] })
})

router.post('/', async (req, res) => {
  const { toId, toRole, message } = req.body
  const fromUserId = req.userId
  const role = req.role

  if (role === toRole) return res.status(400).json({ message: 'Cannot send request to same role' })

  let fromStartupId = null
  let fromInvestorId = null
  let toStartupId = null
  let toInvestorId = null

  let startupForEmail = null
  let investorForEmail = null

  if (role === 'startup') {
    const startup = await prisma.startup.findUnique({
      where: { userId: fromUserId },
      include: { user: { select: { email: true, name: true } } },
    })
    if (!startup) return res.status(400).json({ message: 'Startup profile not found' })
    fromStartupId = startup.id
    startupForEmail = startup
    if (toRole === 'investor') {
      const inv = await prisma.investor.findUnique({
        where: { id: toId },
        include: { user: { select: { email: true, name: true } } },
      })
      if (!inv) return res.status(404).json({ message: 'Investor not found' })
      toInvestorId = inv.id
      investorForEmail = inv
    }
  } else {
    const investor = await prisma.investor.findUnique({ where: { userId: fromUserId } })
    if (!investor) return res.status(400).json({ message: 'Investor profile not found' })
    fromInvestorId = investor.id
    if (toRole === 'startup') {
      const st = await prisma.startup.findUnique({ where: { id: toId } })
      if (!st) return res.status(404).json({ message: 'Startup not found' })
      toStartupId = st.id
    }
  }

  let created
  try {
    created = await prisma.connectionRequest.create({
      data: {
        fromRole: role,
        fromStartupId,
        fromInvestorId,
        toStartupId,
        toInvestorId,
        message: message && String(message).trim() ? String(message).trim().slice(0, 500) : null,
      },
    })
  } catch (err) {
    console.error('ConnectionRequest create failed:', err)
    const msg = err?.message || ''
    if (msg.includes('Unknown arg') || msg.includes('Unknown field') || msg.includes('column') || msg.includes('message')) {
      return res.status(500).json({
        message: 'Server database schema is out of date. Ask the admin to run: npm run db:push (in the server folder).',
      })
    }
    return res.status(500).json({ message: 'Failed to send pitch. Try again.' })
  }

  // Fire-and-forget email; do not block response on SMTP errors
  if (role === 'startup' && investorForEmail?.user?.email) {
    const startupName = startupForEmail?.startupName
    const founderName = startupForEmail?.founderName || startupForEmail?.user?.name
    const sector = startupForEmail?.sector
    const pitch = startupForEmail?.pitch
    const note = created.message || null

    sendPitchEmail({
      to: investorForEmail.user.email,
      investorName: investorForEmail.fullName || investorForEmail.user.name,
      startupName,
      founderName,
      sector,
      pitch,
      message: note,
    }).catch((err) => {
      console.error('Failed to send pitch email', err)
    })
  }

  res.status(201).json({ ok: true })
})

router.post('/:id/accept', async (req, res) => {
  const request = await prisma.connectionRequest.findUnique({ where: { id: req.params.id } })
  if (!request) return res.status(404).json({ message: 'Not found' })
  const myStartup = await prisma.startup.findUnique({ where: { userId: req.userId } })
  const myInvestor = await prisma.investor.findUnique({ where: { userId: req.userId } })
  const isReceiver = (request.toStartupId && myStartup?.id === request.toStartupId) || (request.toInvestorId && myInvestor?.id === request.toInvestorId)
  if (!isReceiver) return res.status(403).json({ message: 'Forbidden' })
  await prisma.connectionRequest.update({
    where: { id: req.params.id },
    data: { status: 'accepted' },
  })
  res.json({ ok: true })
})

router.post('/:id/decline', async (req, res) => {
  const request = await prisma.connectionRequest.findUnique({ where: { id: req.params.id } })
  if (!request) return res.status(404).json({ message: 'Not found' })
  const myStartup = await prisma.startup.findUnique({ where: { userId: req.userId } })
  const myInvestor = await prisma.investor.findUnique({ where: { userId: req.userId } })
  const isReceiver = (request.toStartupId && myStartup?.id === request.toStartupId) || (request.toInvestorId && myInvestor?.id === request.toInvestorId)
  if (!isReceiver) return res.status(403).json({ message: 'Forbidden' })
  await prisma.connectionRequest.update({
    where: { id: req.params.id },
    data: { status: 'declined' },
  })
  res.json({ ok: true })
})

export default router
