import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { EmptyState } from '../../components/ui/EmptyState'
import { CompassIllustration } from '../../assets/illustrations/CompassIllustration'
import { api, isNetworkError } from '../../api/client'
import { matchScoreApi, dashboardApi, savedApi } from '../../api/endpoints'

interface Match {
  id: string
  name: string
  firmName?: string
  preferredSectors: string[]
  preferredStages: string[]
  ticketMin: number
  ticketMax: number
  matchScore: number
  scoreSource?: string
}

interface MatchInsights {
  score: number
  contributions: {
    sector: { match: boolean; contribution: number; startup: string; investor: string }
    stage: { match: boolean; contribution: number; startup: string; investor: string }
    funding: { fit: boolean; contribution: number; startup_ask: number; investor_range: number[] }
    idea_similarity: { score: number; contribution: number; description: string }
  }
  breakdown: {
    strengths: string[]
    weaknesses: string[]
  }
}

export default function StartupMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [startupData, setStartupData] = useState<any>(null)
  const [insightsMap, setInsightsMap] = useState<Record<string, MatchInsights>>({})
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({})
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [searchParams] = useSearchParams()

  const fetchMatches = async () => {
    try {
      setError(null)
      setLoading(true)

      const viewingSaved = searchParams.get('saved') === '1'

      let formatted: Match[] = []

      if (viewingSaved) {
        const res = await savedApi.list()
        formatted = (res.data.saved || []).map((m: any) => ({
          id: m.id,
          name: m.name ?? 'Unknown Investor',
          firmName: m.firmName ?? undefined,
          preferredSectors: m.preferredSectors || [],
          preferredStages: m.preferredStages || [],
          ticketMin: m.ticketMin ?? 0,
          ticketMax: m.ticketMax ?? 0,
          matchScore: 0,
        }))
      } else {
        const params: Record<string, string> = {}
        if (sector) params.sector = sector
        if (stage) params.stage = stage

        const res = await api.get('/matches', { params })

        formatted = (res.data.matches || []).map(
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
      }

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
  }, [sector, stage, searchParams])

  // Fetch startup data once
  useEffect(() => {
    dashboardApi.get()
      .then((res) => setStartupData(res.data.startup))
      .catch((err) => console.error('Failed to fetch startup data:', err))
  }, [])

  const fetchInsights = async (match: Match) => {
    if (insightsMap[match.id] || loadingInsights[match.id] || !startupData) return
    
    setLoadingInsights(prev => ({ ...prev, [match.id]: true }))
    try {
      const explainRes = await matchScoreApi.explain(startupData, {
        preferredSectors: match.preferredSectors,
        preferredStages: match.preferredStages,
        ticketMin: match.ticketMin,
        ticketMax: match.ticketMax,
      })
      setInsightsMap(prev => ({ ...prev, [match.id]: explainRes.data }))
    } catch (err) {
      console.error('Failed to fetch insights for match:', err)
    } finally {
      setLoadingInsights(prev => ({ ...prev, [match.id]: false }))
    }
  }

  const toggleInsights = (matchId: string, match: Match) => {
    if (expandedCard === matchId) {
      setExpandedCard(null)
    } else {
      setExpandedCard(matchId)
      fetchInsights(match)
    }
  }

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
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-forest-ink/60 font-medium">AI-Powered Ranking</span>
                <span className="text-[10px] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full font-semibold">
                  ML Sorted
                </span>
              </div>
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
                          {m.scoreSource && (
                            <span className="text-[10px] text-forest-ink/50 mt-0.5 inline-block">
                              {m.scoreSource === 'ml' ? '🤖 ML Score' : '📊 Rule-based'}
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className={`text-sm font-bold ${m.matchScore === 0 ? 'text-forest-ink/40' : 'text-terracotta'}`}>
                            {m.matchScore}%
                          </span>
                          {m.matchScore === 0 && (
                            <p className="text-[10px] text-forest-ink/50 mt-0.5">Calculating...</p>
                          )}
                        </div>
                      </div>

                      {/* ===== Match Progress Bar ===== */}
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full transition-all duration-500 ${
                            m.matchScore >= 80 ? 'bg-green-600' : 
                            m.matchScore >= 60 ? 'bg-terracotta' : 
                            m.matchScore > 0 ? 'bg-yellow-500' : 'bg-forest-ink/30'
                          }`}
                          style={{ width: `${Math.max(m.matchScore, 5)}%` }}
                        />
                        {m.matchScore === 0 && (
                          <div className="text-[10px] text-forest-ink/50 mt-1 text-center">
                            Score being calculated - click "Show AI Insights" for details
                          </div>
                        )}
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
                      <p className="text-sm font-medium text-forest-ink mb-4">
                        Investment Range: ₹{m.ticketMin}L – ₹{m.ticketMax}L
                      </p>

                      {/* ===== Model Insights Toggle ===== */}
                      <button
                        onClick={() => toggleInsights(m.id, m)}
                        className="w-full mb-4 text-xs text-terracotta hover:text-terracotta/80 font-medium flex items-center justify-between py-2 px-3 bg-terracotta/5 rounded-lg hover:bg-terracotta/10 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon icon="solar:chart-2-linear" className="text-sm" />
                          {expandedCard === m.id ? 'Hide' : 'Show'} AI Insights
                        </span>
                        <Icon 
                          icon={expandedCard === m.id ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'} 
                          className="text-sm" 
                        />
                      </button>

                      {/* ===== Model Insights Panel ===== */}
                      {expandedCard === m.id && (
                        <div className="mb-4 p-4 bg-forest-ink/5 rounded-lg border border-border">
                          {loadingInsights[m.id] ? (
                            <div className="flex items-center justify-center py-4">
                              <div className="w-5 h-5 border-2 border-terracotta border-t-transparent rounded-full animate-spin"></div>
                              <span className="ml-2 text-xs text-forest-ink/60">Analyzing match...</span>
                            </div>
                          ) : insightsMap[m.id] ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-forest-ink">Match Breakdown</span>
                                <span className="text-xs text-forest-ink/60">Score: {insightsMap[m.id].score}%</span>
                              </div>
                              
                              {/* Factor Contributions */}
                              <div className="space-y-2">
                                {insightsMap[m.id].contributions.sector && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-forest-ink/70">Sector Match</span>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs ${insightsMap[m.id].contributions.sector.match ? 'text-green-600' : 'text-red-600'}`}>
                                        {insightsMap[m.id].contributions.sector.match ? '✓' : '✗'}
                                      </span>
                                      <span className="text-forest-ink/60">+{insightsMap[m.id].contributions.sector.contribution.toFixed(1)} pts</span>
                                    </div>
                                  </div>
                                )}
                                {insightsMap[m.id].contributions.stage && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-forest-ink/70">Stage Match</span>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs ${insightsMap[m.id].contributions.stage.match ? 'text-green-600' : 'text-red-600'}`}>
                                        {insightsMap[m.id].contributions.stage.match ? '✓' : '✗'}
                                      </span>
                                      <span className="text-forest-ink/60">+{insightsMap[m.id].contributions.stage.contribution.toFixed(1)} pts</span>
                                    </div>
                                  </div>
                                )}
                                {insightsMap[m.id].contributions.funding && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-forest-ink/70">Funding Fit</span>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs ${insightsMap[m.id].contributions.funding.fit ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {insightsMap[m.id].contributions.funding.fit ? '✓' : '~'}
                                      </span>
                                      <span className="text-forest-ink/60">+{insightsMap[m.id].contributions.funding.contribution.toFixed(1)} pts</span>
                                    </div>
                                  </div>
                                )}
                                {insightsMap[m.id].contributions.idea_similarity && (
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-forest-ink/70">Idea Similarity</span>
                                    <span className="text-forest-ink/60">
                                      {(insightsMap[m.id].contributions.idea_similarity.score * 100).toFixed(0)}% (+{insightsMap[m.id].contributions.idea_similarity.contribution.toFixed(1)} pts)
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Strengths & Weaknesses */}
                              {(insightsMap[m.id].breakdown.strengths.length > 0 || insightsMap[m.id].breakdown.weaknesses.length > 0) && (
                                <div className="pt-2 border-t border-border space-y-2">
                                  {insightsMap[m.id].breakdown.strengths.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-green-700 mb-1">Strengths:</p>
                                      <ul className="space-y-0.5">
                                        {insightsMap[m.id].breakdown.strengths.map((s, i) => (
                                          <li key={i} className="text-xs text-forest-ink/70 flex items-center gap-1">
                                            <Icon icon="solar:check-circle-linear" className="text-green-600 text-xs" />
                                            {s}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {insightsMap[m.id].breakdown.weaknesses.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-red-700 mb-1">Areas to Address:</p>
                                      <ul className="space-y-0.5">
                                        {insightsMap[m.id].breakdown.weaknesses.map((w, i) => (
                                          <li key={i} className="text-xs text-forest-ink/70 flex items-center gap-1">
                                            <Icon icon="solar:info-circle-linear" className="text-red-600 text-xs" />
                                            {w}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-forest-ink/60 text-center py-2">Unable to load insights</p>
                          )}
                        </div>
                      )}

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
