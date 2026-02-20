import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { createServer } from 'http'
import { setupWebSocket } from './websocket.js'
import authRoutes from './routes/auth.js'
import matchesRoutes from './routes/matches.js'
import startupsRoutes from './routes/startups.js'
import investorsRoutes from './routes/investors.js'
import requestsRoutes from './routes/requests.js'
import catalogRoutes from './routes/catalog.js'
import savedRoutes from './routes/saved.js'
import pitchRoutes from './routes/pitch.js'
import matchScoreRoutes from './routes/matchScore.js'
import dashboardRoutes from './routes/dashboard.js'
import notificationsRoutes from './routes/notifications.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration - allow localhost for dev and production frontend URL
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean) // Remove undefined values

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true 
}))
app.use(cookieParser())
app.use(express.json())

// Serve uploaded PDFs so they open in browser (same folder as upload route in routes/startups.js)
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

app.get('/api/uploads/:filename', (req, res) => {
  const filename = req.params.filename
  if (!/^pitch-[a-zA-Z0-9.-]+\.pdf$/i.test(filename)) {
    return res.status(400).send('Invalid file name')
  }
  const filePath = path.join(uploadsDir, filename)
  if (!fs.existsSync(filePath)) {
    return res.status(404).type('text/plain').send('File not found')
  }
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline; filename="pitch-deck.pdf"')
  res.sendFile(path.resolve(filePath))
})

app.use('/api/auth', authRoutes)
app.use('/api/matches', matchesRoutes)
app.use('/api/startups', startupsRoutes)
app.use('/api/investors', investorsRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/match-score', matchScoreRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/saved', savedRoutes)
app.use('/api/pitch', pitchRoutes)
app.use('/api/notifications', notificationsRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

// Create HTTP server and attach WebSocket
const server = createServer(app)
setupWebSocket(server)

server.listen(PORT, () => {
  console.log(`VEGA API running at http://localhost:${PORT}`)
  console.log(`WebSocket available at ws://localhost:${PORT}/ws`)
})
