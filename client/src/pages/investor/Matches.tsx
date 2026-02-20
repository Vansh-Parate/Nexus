import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@iconify/react'
import { Sidebar } from '../../components/layout/Sidebar'
import { Badge } from '../../components/ui/Badge'
import { NeoButton } from '../../components/ui/NeoButton'
import { api, isNetworkError } from '../../api/client'
import { matchScoreApi, dashboardApi } from '../../api/endpoints'

interface Match {
  id: string
  startupName: string
  founderName: string
  sector: string
  stage: string
  fundingSought: number
  pitch?: string
  matchScore: number
  description?: string
}

type SortKey = 'score' | 'name' | 'funding'
type ViewMode = 'grid' | 'list'

const PAGE_SIZE = 9

function MatchCard({ match, idx, onExpress, interestSent, interestLoading, naturalExplanation, loadingExplanation }: {
  match: Match; idx: number; onExpress: () => void; interestSent: boolean; interestLoading: boolean; naturalExplanation?: string | null; loadingExplanation: boolean
}) {
  const scoreColor = match.matchScore >= 80 ? 'text-accent-success' : match.matchScore >= 60 ? 'text-primary' : 'text-accent-danger'
  const scoreTrack = match.matchScore >= 80 ? 'bg-accent-success' : match.matchScore >= 60 ? 'bg-primary' : 'bg-accent-danger'
  const initials = match.startupName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.04 }}
      className="group bg-background border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 flex flex-col h-full"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-semibold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-body text-sm font-semibold text-text-primary leading-tight truncate">{match.startupName}</h3>
            <p className="font-body text-[11px] text-text-muted mt-0.5 truncate">{match.founderName}</p>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 ml-2">
          <span className={`font-display text-xl font-semibold ${scoreColor} leading-none`}>{match.matchScore}%</span>
          <div className="h-1 w-10 rounded-full bg-surface-dark mt-1.5 overflow-hidden">
            <div className={`h-full rounded-full ${scoreTrack} transition-all duration-700`} style={{ width: `${match.matchScore}%` }} />
          </div>
        </div>
      </div>

      {/* Natural Language Explanation */}
      {loadingExplanation ? (
        <div className="mb-3 flex items-center gap-2 text-xs text-text-muted">
          <Icon icon="solar:loading-circle-linear" className="animate-spin text-sm" />
          <span>Analyzing match...</span>
        </div>
      ) : naturalExplanation ? (
        <div className="mb-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
          <p className="font-body text-xs text-text-primary leading-relaxed">{naturalExplanation}</p>
        </div>
      ) : null}

      {/* Pitch */}
      {match.pitch && !naturalExplanation && (
        <p className="font-body text-xs text-text-secondary line-clamp-2 mb-3 leading-relaxed">{match.pitch}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <Badge variant="sector">{match.sector}</Badge>
        <Badge variant="stage">{match.stage}</Badge>
        <span className="ml-auto font-body text-xs text-text-muted">₹{match.fundingSought}L</span>
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border/40">
        <Link to={`/startup/profile/${match.id}`} className="flex-1">
          <button className="w-full py-2 rounded-lg text-xs font-medium text-text-secondary border border-border hover:bg-surface transition-colors">
            View Pitch
          </button>
        </Link>
        <button
          onClick={onExpress}
          disabled={interestSent || interestLoading}
          className="flex-1 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {interestSent ? '✓ Sent' : interestLoading ? '...' : 'Connect →'}
        </button>
      </div>
    </motion.div>
  )
}

function MatchListRow({ match, idx, onExpress, interestSent, interestLoading, naturalExplanation, loadingExplanation }: {
  match: Match; idx: number; onExpress: () => void; interestSent: boolean; interestLoading: boolean; naturalExplanation?: string | null; loadingExplanation: boolean
}) {
  const scoreColor = match.matchScore >= 80 ? 'text-accent-success' : match.matchScore >= 60 ? 'text-primary' : 'text-accent-danger'
  const scoreBg = match.matchScore >= 80 ? 'bg-accent-success/10' : match.matchScore >= 60 ? 'bg-primary/10' : 'bg-accent-danger/10'
  const initials = match.startupName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: idx * 0.03 }}
      className="group bg-background border border-border rounded-xl px-5 py-4 hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-display font-semibold text-xs shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-body text-sm font-semibold text-text-primary truncate">{match.startupName}</h3>
            <Badge variant="sector">{match.sector}</Badge>
            <Badge variant="stage">{match.stage}</Badge>
          </div>
          {loadingExplanation ? (
            <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
              <Icon icon="solar:loading-circle-linear" className="animate-spin text-xs" />
              <span>Analyzing match...</span>
            </div>
          ) : naturalExplanation ? (
            <p className="font-body text-xs text-text-primary mt-0.5 line-clamp-1">{naturalExplanation}</p>
          ) : match.pitch ? (
            <p className="font-body text-xs text-text-muted mt-0.5 truncate">{match.pitch}</p>
          ) : null}
        </div>
        <span className="font-body text-xs text-text-muted shrink-0">₹{match.fundingSought}L</span>
        <span className={`${scoreBg} ${scoreColor} font-display text-sm font-semibold px-2.5 py-1 rounded-lg leading-none shrink-0`}>
          {match.matchScore}%
        </span>
        <div className="flex gap-2 shrink-0">
          <Link to={`/startup/profile/${match.id}`}>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-border hover:bg-surface transition-colors">
              View
            </button>
          </Link>
          <button
            onClick={onExpress}
            disabled={interestSent || interestLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {interestSent ? '✓ Sent' : interestLoading ? '...' : 'Connect'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function InvestorMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [interestLoadingId, setInterestLoadingId] = useState<string | null>(null)
  const [interestSentIds, setInterestSentIds] = useState<Set<string>>(() => new Set())
  const [interestError, setInterestError] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const [investorData, setInvestorData] = useState<any>(null)
  const [naturalExplanations, setNaturalExplanations] = useState<Record<string, string | null>>({})
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({})

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch investor data once
  useEffect(() => {
    dashboardApi.get()
      .then((res) => {
        if (res.data.investor) {
          setInvestorData(res.data.investor)
        }
      })
      .catch(() => {
        // Silently fail - explanations will just not show
      })
  }, [])

  // Fetch natural language explanations for matches
  useEffect(() => {
    if (!investorData || matches.length === 0) return

    const fetchExplanations = async () => {
      for (const match of matches) {
        if (naturalExplanations[match.id] !== undefined || loadingExplanations[match.id]) continue

        setLoadingExplanations(prev => ({ ...prev, [match.id]: true }))
        try {
          const explanation = await matchScoreApi.explain(
            {
              id: match.id,
              startupName: match.startupName,
              sector: match.sector,
              stage: match.stage,
              fundingSought: match.fundingSought,
              pitch: match.pitch,
              description: match.description,
            },
            investorData
          )
          setNaturalExplanations(prev => ({
            ...prev,
            [match.id]: explanation.data.naturalExplanation || null,
          }))
        } catch (err) {
          setNaturalExplanations(prev => ({ ...prev, [match.id]: null }))
        } finally {
          setLoadingExplanations(prev => {
            const next = { ...prev }
            delete next[match.id]
            return next
          })
        }
      }
    }

    fetchExplanations()
  }, [matches, investorData])

  const fetchMatches = (page = 1) => {
    setError(null)
    setLoading(true)
    const params: Record<string, string> = { page: String(page), pageSize: String(PAGE_SIZE) }
    if (sector) params.sector = sector
    if (stage) params.stage = stage
    api
      .get('/matches', { params })
      .then((res) => {
        const newMatches = res.data.matches || []
        setMatches(newMatches)
        setTotalCount(res.data.totalCount ?? 0)
        setTotalPages(res.data.totalPages ?? 1)
        setCurrentPage(res.data.page ?? page)
        // Clear old explanations when matches change
        setNaturalExplanations({})
        setLoadingExplanations({})
      })
      .catch((err) => {
        setMatches([])
        setError(isNetworkError(err) ? 'Server unavailable. Start the backend with `npm run dev` in the server folder.' : 'Failed to load matches.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchMatches(1)
  }, [sector, stage])

  // Close filter dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilters(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const expressInterest = async (startupId: string) => {
    if (!startupId || interestLoadingId) return
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

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchMatches(page)
  }

  const sorted = [...matches].sort((a, b) => {
    if (sortKey === 'score') return b.matchScore - a.matchScore
    if (sortKey === 'name') return a.startupName.localeCompare(b.startupName)
    return b.fundingSought - a.fundingSought
  })

  const activeFilterCount = [sector, stage].filter(Boolean).length

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-[4.5rem] pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="font-display text-2xl font-semibold text-text-primary tracking-tight">Startup Matches</h1>
              <p className="font-body text-sm text-text-muted mt-1">
                {loading ? 'Loading...' : `${totalCount} startups matched to your preferences`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex bg-surface rounded-lg p-0.5 border border-transparent">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                >
                  <Icon icon="solar:widget-linear" className="text-base" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                >
                  <Icon icon="solar:list-linear" className="text-base" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="font-body text-xs px-3 py-2 bg-surface border border-transparent rounded-lg text-text-secondary cursor-pointer outline-none hover:border-border transition-colors appearance-none"
              >
                <option value="score">Sort: Match %</option>
                <option value="name">Sort: Name</option>
                <option value="funding">Sort: Funding</option>
              </select>

              {/* Filter */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilters(p => !p)}
                  className={`inline-flex items-center gap-1.5 font-body text-xs px-3 py-2 rounded-lg border transition-colors ${activeFilterCount > 0
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-surface text-text-secondary border-transparent hover:border-border'
                    }`}
                >
                  <Icon icon="solar:filter-linear" className="text-sm" />
                  Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 bg-background border border-border rounded-xl shadow-[var(--shadow-card-hover)] p-4 z-20 space-y-3"
                    >
                      <div>
                        <p className="font-body text-[11px] text-text-muted uppercase tracking-wider mb-1.5">Sector</p>
                        <select
                          className="w-full font-body text-xs px-3 py-2 border border-border rounded-lg bg-surface text-text-primary outline-none"
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                        >
                          <option value="">All Sectors</option>
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
                        <p className="font-body text-[11px] text-text-muted uppercase tracking-wider mb-1.5">Stage</p>
                        <select
                          className="w-full font-body text-xs px-3 py-2 border border-border rounded-lg bg-surface text-text-primary outline-none"
                          value={stage}
                          onChange={(e) => setStage(e.target.value)}
                        >
                          <option value="">All Stages</option>
                          <option value="MVP">MVP</option>
                          <option value="Early Revenue">Early Revenue</option>
                          <option value="Scaling">Scaling</option>
                        </select>
                      </div>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => { setSector(''); setStage('') }}
                          className="font-body text-[11px] text-accent-danger hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Error Banner */}
          <AnimatePresence>
            {interestError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 px-4 py-3 bg-accent-danger/10 border border-accent-danger/20 rounded-xl flex items-center gap-2"
              >
                <Icon icon="solar:danger-triangle-linear" className="text-accent-danger text-lg shrink-0" />
                <p className="font-body text-xs text-accent-danger flex-1">{interestError}</p>
                <button onClick={() => setInterestError(null)} className="text-accent-danger/60 hover:text-accent-danger">
                  <Icon icon="solar:close-circle-linear" className="text-base" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className={`bg-surface rounded-2xl border border-transparent animate-pulse ${viewMode === 'grid' ? 'h-56 p-5' : 'h-16 px-5 py-4'}`} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-surface rounded-2xl p-12 text-center border border-border">
              <Icon icon="solar:server-path-linear" className="text-4xl text-text-muted mx-auto mb-3" />
              <p className="font-body text-sm text-text-secondary mb-4">{error}</p>
              <NeoButton variant="outline" onClick={() => fetchMatches(currentPage)} className="text-xs">
                <Icon icon="solar:refresh-linear" className="text-base" /> Retry
              </NeoButton>
            </div>
          ) : sorted.length === 0 ? (
            <div className="bg-surface rounded-2xl p-14 text-center border border-border">
              <Icon icon="solar:compass-linear" className="text-5xl text-text-muted mx-auto mb-4" />
              <p className="font-display text-lg text-text-primary mb-1">No matches found</p>
              <p className="font-body text-sm text-text-muted mb-5">Try broadening your filters or updating your preferences.</p>
              <div className="flex justify-center gap-3">
                {activeFilterCount > 0 && (
                  <NeoButton variant="outline" className="text-xs" onClick={() => { setSector(''); setStage('') }}>
                    Clear Filters
                  </NeoButton>
                )}
                <Link to="/investor/profile/edit">
                  <NeoButton variant="primary" className="text-xs">Edit Preferences</NeoButton>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sorted.map((m, i) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      idx={i}
                      onExpress={() => expressInterest(m.id)}
                      interestSent={interestSentIds.has(m.id)}
                      interestLoading={interestLoadingId === m.id}
                      naturalExplanation={naturalExplanations[m.id]}
                      loadingExplanation={loadingExplanations[m.id] || false}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {sorted.map((m, i) => (
                    <MatchListRow
                      key={m.id}
                      match={m}
                      idx={i}
                      onExpress={() => expressInterest(m.id)}
                      interestSent={interestSentIds.has(m.id)}
                      interestLoading={interestLoadingId === m.id}
                      naturalExplanation={naturalExplanations[m.id]}
                      loadingExplanation={loadingExplanations[m.id] || false}
                    />
                  ))}
                </div>
              )}

              {/* ===== PAGINATION ===== */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mt-10"
                >
                  {/* Previous */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-background text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon icon="solar:alt-arrow-left-linear" className="text-sm" />
                    Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) =>
                      page === '...' ? (
                        <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-text-muted">
                          ⋯
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200 ${currentPage === page
                              ? 'bg-primary text-white shadow-md'
                              : 'text-text-secondary hover:bg-surface border border-transparent hover:border-border'
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-background text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <Icon icon="solar:alt-arrow-right-linear" className="text-sm" />
                  </button>
                </motion.div>
              )}

              {/* Results Info */}
              {totalCount > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-body text-[11px] text-text-muted text-center mt-3"
                >
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} startups
                </motion.p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
