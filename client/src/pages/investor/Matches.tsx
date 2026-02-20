import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { CompassIllustration } from '../../assets/illustrations/CompassIllustration'
import { api } from '../../api/client'

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
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params: Record<string, string> = {}
    if (sector) params.sector = sector
    if (stage) params.stage = stage
    setLoading(true)
    api.get('/matches', { params })
      .then((res) => setMatches(res.data.matches || []))
      .finally(() => setLoading(false))
  }, [sector, stage])

  const applyFilters = () => {
    setShowFilters(false)
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top bar with filter dropdown */}
      <div className="flex justify-between items-center p-4 border-b border-border bg-white z-10 relative">
        <h1 className="font-display text-2xl font-bold">Investor Matches</h1>
        <div className="relative">
          <NeoButton variant="outline" onClick={() => setShowFilters((prev) => !prev)}>
            Filters ▾
          </NeoButton>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-lg shadow-lg p-4 flex flex-col gap-3 z-20">
              <div>
                <label className="font-body text-sm block mb-1">Sector</label>
                <select
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-warm-sand text-forest-ink"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="EdTech">EdTech</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="AI">AI</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>
              <div>
                <label className="font-body text-sm block mb-1">Stage</label>
                <select
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-warm-sand text-forest-ink"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="MVP">MVP</option>
                  <option value="Early Revenue">Early Revenue</option>
                  <option value="Scaling">Scaling</option>
                </select>
              </div>
              <NeoButton variant="primary" className="w-full text-sm" onClick={applyFilters}>
                Apply
              </NeoButton>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          {loading ? (
            <p className="font-body text-sm">Loading...</p>
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
      </main>
    </div>
  )
}