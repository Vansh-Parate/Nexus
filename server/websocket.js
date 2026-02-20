import { WebSocketServer } from 'ws'
import { verifyToken } from './middleware/authMiddleware.js'

// Map of userId -> Set<WebSocket>
const clients = new Map()

let wss = null

export function setupWebSocket(server) {
    wss = new WebSocketServer({ server, path: '/ws' })

    wss.on('connection', (ws, req) => {
        // Parse JWT from cookie to identify user
        let userId = null

        try {
            const cookieHeader = req.headers.cookie || ''
            const cookies = {}
            cookieHeader.split(';').forEach((c) => {
                const [key, ...rest] = c.trim().split('=')
                if (key) cookies[key] = rest.join('=')
            })

            const token = cookies.token
            if (token) {
                const decoded = verifyToken(token)
                if (decoded) {
                    userId = decoded.userId
                }
            }
        } catch (err) {
            console.error('WebSocket auth error:', err)
        }

        if (!userId) {
            ws.close(4001, 'Unauthorized')
            return
        }

        // Register this connection
        if (!clients.has(userId)) {
            clients.set(userId, new Set())
        }
        clients.get(userId).add(ws)

        // Send a welcome message
        ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }))

        ws.on('close', () => {
            const userSockets = clients.get(userId)
            if (userSockets) {
                userSockets.delete(ws)
                if (userSockets.size === 0) {
                    clients.delete(userId)
                }
            }
        })

        ws.on('error', (err) => {
            console.error('WebSocket error for user', userId, err.message)
        })
    })

    console.log('WebSocket server initialized on /ws')
    return wss
}

/**
 * Send a notification to a specific user through WebSocket.
 * @param {string} userId - The user ID to notify
 * @param {object} payload - The notification payload
 */
export function notifyUser(userId, payload) {
    const userSockets = clients.get(userId)
    if (!userSockets || userSockets.size === 0) return

    const message = JSON.stringify(payload)
    for (const ws of userSockets) {
        if (ws.readyState === 1) { // WebSocket.OPEN
            ws.send(message)
        }
    }
}

/**
 * Broadcast to all connected clients (optional utility).
 */
export function broadcast(payload) {
    if (!wss) return
    const message = JSON.stringify(payload)
    wss.clients.forEach((ws) => {
        if (ws.readyState === 1) {
            ws.send(message)
        }
    })
}
