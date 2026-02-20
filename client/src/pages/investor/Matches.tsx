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
  const [showFilters, setShowFilters] = useState(false)
  const [interestLoadingId, setInterestLoadingId] = useState<string | null>(null)
  const [interestSentIds, setInterestSentIds] = useState<Set<string>>(() => new Set())
  const [interestError, setInterestError] = useState<string | null>(null)

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

  const applyFilters = () => {
    setShowFilters(false)
  }

  const expressInterest = async (startupId: string) => {
    if (!startupId) return
    if (interestLoadingId) return
    setInterestError(null)
    setInterestLoadingId(startupId)
    try {
      await api.post('/requests', { toId: startupId, toRole: 'startup' })
      setInterestSentIds((prev) => new Set([...Array.from(prev), startupId]))
    } catch (err: any) {
      setInterestError(err?.response?.data?.message || 'Failed to send interest. Try again.')
    } finally {
      setInterestLoadingId(null)
    }
  }

  return (
    <div className="min-h-screen flex bg-chalk-white">
      <Sidebar />
      <main className="flex-1 pl-[240px] flex">
        <div className="flex-1 p-10 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-display text-2xl font-bold text-forest-ink">Investor Matches</h1>
              <div className="relative">
                <NeoButton
                  variant="outline"
                  className="text-xs px-3 py-1.5"
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  Filters
                </NeoButton>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-56 bg-chalk-white border border-border rounded-lg shadow-lg p-4 z-10 space-y-3">
                    <div>
                      <p className="font-body text-xs text-forest-ink/70 mb-1">Sector</p>
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
                      <p className="font-body text-xs text-forest-ink/70 mb-1">Stage</p>
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

            {loading ? (
              <p className="font-body text-sm text-forest-ink/70">Loading...</p>
            ) : error ? (
              <NeoCard className="p-12 text-center">
                <p className="font-body text-forest-ink/80">{error}</p>
                <NeoButton variant="primary" className="mt-4" onClick={fetchMatches}>
                  Retry
                </NeoButton>
              </NeoCard>
            ) : interestError ? (
              <NeoCard className="p-4 mb-4 border border-red-200 bg-red-50">
                <p className="font-body text-sm text-red-700">{interestError}</p>
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
                      <NeoButton
                        variant="primary"
                        className="text-sm"
                        onClick={() => expressInterest(m.id)}
                        disabled={interestLoadingId === m.id || interestSentIds.has(m.id)}
                      >
                        {interestSentIds.has(m.id)
                          ? 'Interest Sent'
                          : interestLoadingId === m.id
                            ? 'Sending...'
                            : 'Express Interest →'}
                      </NeoButton>
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
