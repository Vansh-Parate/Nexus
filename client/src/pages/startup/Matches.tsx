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
  name: string
  firmName?: string
  preferredSectors: string[]
  preferredStages: string[]
  ticketMin: number
  ticketMax: number
  matchScore: number
}

export default function StartupMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const fetchMatches = async () => {
    try {
      setError(null)
      setLoading(true)

      const params: Record<string, string> = {}
      if (sector) params.sector = sector
      if (stage) params.stage = stage

      const res = await api.get('/matches', { params })

      const formatted: Match[] = (res.data.matches || []).map(
        (m: any) => ({
          id: m.id || m._id,
          name: m.fullName ?? m.name ?? 'Unknown Investor',
          firmName: m.firmName ?? undefined,
          preferredSectors: m.preferredSectors || [],
          preferredStages: m.preferredStages || [],
          ticketMin: m.ticketMin ?? 0,
          ticketMax: m.ticketMax ?? 0,
          matchScore: m.matchScore ?? 0,
        })
      )

      setMatches(formatted)
    } catch (err) {
      console.error('Error fetching matches:', err)
      setMatches([])
      setError(
        isNetworkError(err)
          ? 'Server unavailable. Start the backend with `npm run dev` in the server folder.'
          : 'Failed to load matches.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [sector, stage])

  return (
    <div className="min-h-screen flex bg-chalk-white">
      <Sidebar />

      <main className="flex-1 pl-[240px] flex">
        {/* ================= MATCHES SECTION ================= */}
        <div className="flex-1 p-10 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl"
          >
            <div className="flex justify-end mb-4">
              <div className="relative">
                <NeoButton
                  variant="outline"
                  className="text-xs px-3 py-1.5"
                  onClick={() => setFiltersOpen((open) => !open)}
                >
                  Filters
                </NeoButton>
                {filtersOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-chalk-white border border-border rounded-lg shadow-lg p-4 z-10 space-y-3">
                    <div>
                      <p className="font-body text-xs text-forest-ink/70 mb-1">
                        Sector
                      </p>
                      <select
                        className="w-full text-xs px-2 py-1.5 border rounded bg-white"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                      >
                        <option value="">All Sectors</option>
                        <option value="EdTech">EdTech</option>
                        <option value="FinTech">FinTech</option>
                        <option value="SaaS">SaaS</option>
                      </select>
                    </div>
                    <div>
                      <p className="font-body text-xs text-forest-ink/70 mb-1">
                        Stage
                      </p>
                      <select
                        className="w-full text-xs px-2 py-1.5 border rounded bg-white"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                      >
                        <option value="">All Stages</option>
                        <option value="Idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="Early Revenue">Early Revenue</option>
                        <option value="Scaling">Scaling</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="text-xs underline text-forest-ink"
                      onClick={() => {
                        setSector('')
                        setStage('')
                      }}
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>
            {loading ? (
              <div className="text-center py-20">
                <p className="text-sm text-forest-ink/60">
                  Finding best investor matches...
                </p>
              </div>
            ) : error ? (
              <NeoCard className="p-12 text-center">
                <p className="font-body text-forest-ink/80">{error}</p>
                <NeoButton variant="primary" className="mt-4" onClick={fetchMatches}>
                  Retry
                </NeoButton>
              </NeoCard>
            ) : matches.length === 0 ? (
              <EmptyState
                illustration={<CompassIllustration />}
                message="No matches yet — try broadening your filters"
              />
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {matches.map((m) => (
                  <motion.div
                    key={m.id}
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <NeoCard className="p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300">
                      {/* ===== Header ===== */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-forest-ink">
                            {m.name}
                          </h3>
                          <p className="text-xs text-forest-ink/60">
                            {m.firmName || 'Independent Investor'}
                          </p>
                        </div>

                        <span className="text-sm font-bold text-terracotta">
                          {m.matchScore}%
                        </span>
                      </div>

                      {/* ===== Match Progress Bar ===== */}
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-terracotta transition-all duration-500"
                          style={{ width: `${m.matchScore}%` }}
                        />
                      </div>

                      {/* ===== Sectors ===== */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {m.preferredSectors.slice(0, 3).map((s, i) => (
                          <Badge key={`${m.id}-sector-${i}`} variant="stage">
                            {s}
                          </Badge>
                        ))}
                      </div>

                      {/* ===== Stages ===== */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {m.preferredStages.slice(0, 2).map((st, i) => (
                          <Badge key={`${m.id}-stage-${i}`} variant="stage">
                            {st}
                          </Badge>
                        ))}
                      </div>

                      {/* ===== Ticket Range ===== */}
                      <p className="text-sm font-medium text-forest-ink mb-6">
                        Investment Range: ₹{m.ticketMin}L – ₹{m.ticketMax}L
                      </p>

                      {/* ===== Actions ===== */}
                      <div className="mt-auto space-y-2">
                        <Link to={`/investor/profile/${m.id}`}>
                          <NeoButton
                            variant="outline"
                            className="w-full text-sm"
                          >
                            View Profile
                          </NeoButton>
                        </Link>

                        <Link to={`/startup/pitch/send/${m.id}`}>
                          <NeoButton
                            variant="primary"
                            className="w-full text-sm"
                          >
                            Send Pitch Request →
                          </NeoButton>
                        </Link>
                      </div>
                    </NeoCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
