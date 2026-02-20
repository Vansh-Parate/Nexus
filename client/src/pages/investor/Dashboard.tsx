import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { Sidebar } from '../../components/layout/Sidebar'
import { Badge } from '../../components/ui/Badge'
import { NeoButton } from '../../components/ui/NeoButton'
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

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const strokeWidth = 5
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#7a9b76' : score >= 50 ? '#d4a574' : '#c77567'

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#e8e3dc" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out"
        style={{ animation: 'ring-draw 1.5s ease-out forwards' }}
      />
    </svg>
  )
}

function StatCard({ icon, label, value, delay }: { icon: string; label: string; value: string | number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group bg-surface rounded-2xl p-5 border border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon icon={icon} className="text-primary text-sm" />
        </div>
        <span className="font-body text-xs text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-3xl font-semibold text-text-primary tracking-tight leading-none">{value}</p>
    </motion.div>
  )
}

function StartupCard({ match, delay, onExpress }: { match: Match; delay: number; onExpress: () => void }) {
  const scoreColor = match.matchScore >= 80 ? 'text-accent-success' : match.matchScore >= 60 ? 'text-primary' : 'text-accent-danger'
  const scoreBg = match.matchScore >= 80 ? 'bg-accent-success/10' : match.matchScore >= 60 ? 'bg-primary/10' : 'bg-accent-danger/10'
  const initials = match.startupName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="group bg-background border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-semibold text-sm">
            {initials}
          </div>
          <div>
            <h3 className="font-body text-sm font-semibold text-text-primary leading-tight">{match.startupName}</h3>
            <p className="font-body text-xs text-text-muted mt-0.5">{match.founderName}</p>
          </div>
        </div>
        <span className={`${scoreBg} ${scoreColor} font-display text-lg font-semibold px-2.5 py-1 rounded-lg leading-none`}>
          {match.matchScore}%
        </span>
      </div>

      {/* Pitch */}
      {match.pitch && (
        <p className="font-body text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">{match.pitch}</p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        <Badge variant="sector">{match.sector}</Badge>
        <Badge variant="stage">{match.stage}</Badge>
        <span className="font-label text-[11px] text-text-muted">₹{match.fundingSought}L</span>
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-2 border-t border-border/50">
        <Link to={`/startup/profile/${match.id}`} className="flex-1">
          <button className="w-full py-2 rounded-lg text-xs font-medium text-text-secondary border border-border hover:bg-surface transition-colors">
            View Pitch
          </button>
        </Link>
        <button
          onClick={onExpress}
          className="flex-1 py-2 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          Connect →
        </button>
      </div>
    </motion.div>
  )
}

export default function InvestorDashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = () => {
    setError(null)
    setLoading(true)
    api
      .get('/matches')
      .then((res) => setMatches(res.data.matches || []))
      .catch((err) => {
        setMatches([])
        setError(isNetworkError(err) ? 'Server unavailable. Start the backend with `npm run dev` in the server folder.' : 'Failed to load matches.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const avgScore = matches.length ? Math.round(matches.reduce((a, m) => a + m.matchScore, 0) / matches.length) : 0
  const highMatches = matches.filter(m => m.matchScore >= 80).length
  const topScore = matches.length ? Math.max(...matches.map(m => m.matchScore)) : 0

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
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h1 className="font-display text-2xl font-semibold text-text-primary tracking-tight">Dashboard</h1>
              <p className="font-body text-sm text-text-muted mt-1">Your investor overview at a glance</p>
            </div>
            <Link to="/investor/profile/edit">
              <NeoButton variant="outline" className="text-xs gap-1.5">
                <Icon icon="solar:settings-linear" className="text-base" />
                Preferences
              </NeoButton>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon="solar:users-group-rounded-linear" label="Startups Found" value={matches.length} delay={0.05} />
            <StatCard icon="solar:fire-bold" label="High Matches" value={highMatches} delay={0.1} />
            <StatCard icon="solar:star-bold" label="Top Score" value={topScore ? `${topScore}%` : '—'} delay={0.15} />
            <StatCard icon="solar:chart-2-linear" label="Avg Match" value={avgScore ? `${avgScore}%` : '—'} delay={0.2} />
          </div>

          {/* Match Quality Ring + Quick Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
          >
            {/* Ring Card */}
            <div className="bg-surface rounded-2xl p-6 flex flex-col items-center justify-center border border-transparent">
              <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-4">Match Quality</p>
              <div className="relative">
                <ScoreRing score={avgScore} size={120} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-3xl font-semibold text-text-primary leading-none">{avgScore}</span>
                  <span className="font-body text-[10px] text-text-muted">/100</span>
                </div>
              </div>
              <div className="flex gap-4 mt-5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-success" />
                  <span className="font-body text-[10px] text-text-muted">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-body text-[10px] text-text-muted">Med</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-danger" />
                  <span className="font-body text-[10px] text-text-muted">Low</span>
                </div>
              </div>
            </div>

            {/* Distribution breakdown */}
            <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-transparent flex flex-col justify-between">
              <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-5">Match Distribution</p>
              <div className="space-y-4">
                {[
                  { label: 'High (≥80%)', count: matches.filter(m => m.matchScore >= 80).length, color: 'bg-accent-success', total: matches.length },
                  { label: 'Medium (60–79%)', count: matches.filter(m => m.matchScore >= 60 && m.matchScore < 80).length, color: 'bg-primary', total: matches.length },
                  { label: 'Low (<60%)', count: matches.filter(m => m.matchScore < 60).length, color: 'bg-accent-danger', total: matches.length },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-body text-xs text-text-secondary">{row.label}</span>
                      <span className="font-body text-xs font-semibold text-text-primary">{row.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-dark overflow-hidden">
                      <div
                        className={`h-full rounded-full ${row.color} transition-all duration-700`}
                        style={{ width: row.total ? `${(row.count / row.total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border/50">
                <Link to="/investor/matches" className="font-body text-xs text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                  Explore all matches <Icon icon="solar:arrow-right-linear" className="text-sm" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Recommended Startups */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-text-primary tracking-tight">Recommended Startups</h2>
              <Link to="/investor/matches" className="font-body text-xs text-primary font-semibold hover:text-primary-dark transition-colors inline-flex items-center gap-1">
                View All <Icon icon="solar:arrow-right-linear" className="text-sm" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-surface rounded-2xl p-5 border border-transparent animate-pulse h-52" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-surface rounded-2xl p-10 text-center border border-border">
                <Icon icon="solar:server-path-linear" className="text-4xl text-text-muted mx-auto mb-3" />
                <p className="font-body text-sm text-text-secondary mb-4">{error}</p>
                <NeoButton variant="outline" onClick={fetchMatches} className="text-xs">
                  <Icon icon="solar:refresh-linear" className="text-base" /> Retry
                </NeoButton>
              </div>
            ) : matches.length === 0 ? (
              <div className="bg-surface rounded-2xl p-12 text-center border border-border">
                <Icon icon="solar:compass-linear" className="text-5xl text-text-muted mx-auto mb-4" />
                <p className="font-display text-lg text-text-primary mb-1">No matches yet</p>
                <p className="font-body text-sm text-text-muted mb-5">Complete your investment preferences to start seeing startups.</p>
                <Link to="/investor/profile/edit">
                  <NeoButton variant="primary" className="text-xs">Set Preferences</NeoButton>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matches.slice(0, 6).map((m, i) => (
                  <StartupCard key={m.id} match={m} delay={0.05 * i} onExpress={() => { }} />
                ))}
              </div>
            )}
          </motion.section>

          {/* Preference Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-surface rounded-2xl p-6 border border-transparent flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon icon="solar:tuning-2-linear" className="text-primary text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-body text-sm font-semibold text-text-primary">Investment Preferences</h3>
              <p className="font-body text-xs text-text-muted mt-0.5">Your preferences define which startups surface as matches. Keep them updated for better results.</p>
            </div>
            <Link to="/investor/profile/edit">
              <NeoButton variant="outline" className="text-xs shrink-0">
                Edit Preferences
              </NeoButton>
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
