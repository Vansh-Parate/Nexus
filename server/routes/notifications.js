import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/authMiddleware.js'

const prisma = new PrismaClient()
const router = Router()

router.use(authMiddleware)

// Get all notifications for the current user (newest first)
router.get('/', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        })
        const unreadCount = await prisma.notification.count({
            where: { userId: req.userId, read: false },
        })
        res.json({ notifications, unreadCount })
    } catch (e) {
        console.error('Notifications fetch error:', e)
        res.status(500).json({ message: 'Failed to fetch notifications' })
    }
})

// Mark all as read
router.post('/mark-all-read', async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.userId, read: false },
            data: { read: true },
        })
        res.json({ ok: true })
    } catch (e) {
        console.error('Mark all read error:', e)
        res.status(500).json({ message: 'Failed to mark notifications as read' })
    }
})

// Mark a single notification as read
router.post('/:id/read', async (req, res) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id },
            data: { read: true },
        })
        res.json({ ok: true })
    } catch (e) {
        console.error('Mark read error:', e)
        res.status(500).json({ message: 'Failed to mark notification as read' })
    }
})

export default router
