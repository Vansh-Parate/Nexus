import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { EmptyState } from '../../components/ui/EmptyState'
import { CompassIllustration } from '../../assets/illustrations/CompassIllustration'
import { api, isNetworkError } from '../../api/client'

interface Match {
  id: string
  startupName: string
  founderName: string
  sector: string
  stage: string
  fundingSought: number
  pitch?: string
  matchScore: number
}

export default function InvestorMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')

  const fetchMatches = () => {
    setError(null)
    setLoading(true)
    const params: Record<string, string> = {}
    if (sector) params.sector = sector
    if (stage) params.stage = stage
    api
      .get('/matches', { params })
      .then((res) => setMatches(res.data.matches || []))
      .catch((err) => {
        setMatches([])
        setError(isNetworkError(err) ? 'Server unavailable. Start the backend with `npm run dev` in the server folder.' : 'Failed to load matches.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMatches()
  }, [sector, stage])

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pl-[240px] flex">
        <aside className="w-[280px] shrink-0 p-6 border-r border-border bg-forest-ink text-cream">
          <h2 className="font-display text-2xl font-bold mb-4">Filters</h2>
          <label className="font-body text-sm block mb-2">Sector</label>
          <select
            className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-warm-sand text-forest-ink mb-4"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="">All</option>
            <option value="EdTech">EdTech</option>
            <option value="FinTech">FinTech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="SaaS">SaaS</option>
          </select>
          <label className="font-body text-sm block mb-2">Stage</label>
          <select
            className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-warm-sand text-forest-ink mb-4"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">All</option>
            <option value="Idea">Idea</option>
            <option value="MVP">MVP</option>
            <option value="Early Revenue">Early Revenue</option>
            <option value="Scaling">Scaling</option>
          </select>
          <NeoButton variant="primary" className="w-full">Apply</NeoButton>
        </aside>

        <div className="flex-1 p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            {loading ? (
              <p className="font-body text-sm">Loading...</p>
            ) : error ? (
              <NeoCard className="p-12 text-center">
                <p className="font-body text-forest-ink/80">{error}</p>
                <NeoButton variant="primary" className="mt-4" onClick={fetchMatches}>Retry</NeoButton>
              </NeoCard>
            ) : matches.length === 0 ? (
              <EmptyState
                illustration={<CompassIllustration />}
                message="No matches yet — try broadening your filters"
              />
            ) : (
              <div className="space-y-4">
                {matches.map((m) => (
                  <NeoCard key={m.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-xl font-bold text-forest-ink">{m.startupName}</h3>
                        <span className="font-body text-sm font-bold bg-terracotta/15 text-terracotta px-2 py-0.5 rounded-md">
                          {m.matchScore}%
                        </span>
                      </div>
                      <p className="font-body text-sm text-forest-ink/80 mt-1 line-clamp-2">{m.pitch || '—'}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="sector">{m.sector}</Badge>
                        <Badge variant="stage">{m.stage}</Badge>
                      </div>
                    </div>
                    <p className="font-body text-lg font-bold text-forest-ink">₹{m.fundingSought}L</p>
                    <div className="flex gap-2 shrink-0">
                      <Link to={`/startup/profile/${m.id}`}>
                        <NeoButton variant="outline" className="text-sm">View Pitch</NeoButton>
                      </Link>
                      <NeoButton variant="primary" className="text-sm">Express Interest →</NeoButton>
                    </div>
                  </NeoCard>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
