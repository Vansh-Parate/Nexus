import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { signToken } from '../middleware/authMiddleware.js'

const prisma = new PrismaClient()
const router = Router()

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

router.post('/register', async (req, res) => {
  try {
    const body = req.body
    const role = body.role
    const email = body.email
    const password = body.password
    if (!role || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const name = role === 'startup' ? body.founderName : body.fullName

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role,
        name: name || email,
      },
    })

    if (role === 'startup') {
      await prisma.startup.create({
        data: {
          userId: user.id,
          startupName: body.startupName || 'My Startup',
          founderName: body.founderName || name || 'Founder',
          sector: body.sector || 'SaaS',
          stage: body.stage || 'Idea',
          fundingSought: Number(body.fundingSought) || 50,
          pitch: body.pitch || null,
          location: body.location || null,
        },
      })
    } else {
      await prisma.investor.create({
        data: {
          userId: user.id,
          fullName: body.fullName || name || 'Investor',
          firmName: body.firmName || null,
          investorType: body.investorType || 'Angel',
          preferredSectors: Array.isArray(body.preferredSectors) ? body.preferredSectors : [],
          ticketMin: Number(body.ticketMin) || 10,
          ticketMax: Number(body.ticketMax) || 500,
          preferredStages: Array.isArray(body.preferredStages) ? body.preferredStages : [],
          portfolioSize: body.portfolioSize ? Number(body.portfolioSize) : null,
        },
      })
    }

    const token = signToken({ userId: user.id, role })
    res.cookie('token', token, cookieOptions)
    const u = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true, role: true },
    })
    res.status(201).json({ user: u })
  } catch (e) {
    console.error('Registration error:', e)
    const message = process.env.NODE_ENV === 'development' ? (e?.message || 'Registration failed') : 'Registration failed'
    res.status(500).json({ message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== role) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid email or password' })

    const token = signToken({ userId: user.id, role: user.role })
    res.cookie('token', token, cookieOptions)
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (e) {
    console.error('Login error:', e)
    const message = process.env.NODE_ENV === 'development' ? (e?.message || 'Login failed') : 'Login failed'
    res.status(500).json({ message })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' })
  res.json({ ok: true })
})

router.get('/me', async (req, res) => {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ message: 'Not logged in' })
  const { verifyToken } = await import('../middleware/authMiddleware.js')
  const decoded = verifyToken(token)
  if (!decoded) {
    res.clearCookie('token')
    return res.status(401).json({ message: 'Invalid token' })
  }
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!user) return res.status(401).json({ message: 'User not found' })
  res.json({ user })
})

export default router
