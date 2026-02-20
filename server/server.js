import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import matchesRoutes from './routes/matches.js'
import startupsRoutes from './routes/startups.js'
import investorsRoutes from './routes/investors.js'
import requestsRoutes from './routes/requests.js'
import catalogRoutes from './routes/catalog.js'
import matchScoreRoutes from './routes/matchScore.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/matches', matchesRoutes)
app.use('/api/startups', startupsRoutes)
app.use('/api/investors', investorsRoutes)
app.use('/api/requests', requestsRoutes)
app.use('/api/catalog', catalogRoutes)
app.use('/api/match-score', matchScoreRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`VEGA API running at http://localhost:${PORT}`)
})
