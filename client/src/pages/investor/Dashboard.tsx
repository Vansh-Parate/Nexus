import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
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

export default function InvestorDashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/matches').then((res) => setMatches(res.data.matches || [])).finally(() => setLoading(false))
  }, [])

  const avgScore = matches.length ? Math.round(matches.reduce((a, m) => a + m.matchScore, 0) / matches.length) : 0

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pl-[240px] p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1280px] mx-auto"
        >
          <h1 className="font-display text-3xl font-bold text-forest-ink mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Startups Browsed</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">{matches.length}</p>
            </NeoCard>
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Requests Received</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">—</p>
            </NeoCard>
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Connections Active</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">—</p>
            </NeoCard>
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Avg Match Score</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">{avgScore}%</p>
            </NeoCard>
          </div>

          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-forest-ink">Recommended Startups</h2>
              <Link to="/investor/matches" className="font-body text-sm text-terracotta underline">
                View All →
              </Link>
            </div>
            {loading ? (
              <p className="font-body text-sm text-forest-ink/70">Loading...</p>
            ) : matches.length === 0 ? (
              <NeoCard className="p-12 text-center">
                <p className="font-body text-forest-ink/80">Complete your preferences to see startups.</p>
                <Link to="/investor/profile/edit">
                  <NeoButton variant="primary" className="mt-4">Edit Preferences</NeoButton>
                </Link>
              </NeoCard>
            ) : (
              <div className="space-y-4">
                {matches.slice(0, 5).map((m) => (
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
          </section>

          <NeoCard className="p-6">
            <h3 className="font-display text-xl font-bold text-forest-ink mb-2">Preference Summary</h3>
            <p className="font-body text-sm text-forest-ink/80 mb-4">Your current investment preferences are used for matching.</p>
            <Link to="/investor/profile/edit">
              <NeoButton variant="outline">Edit Preferences</NeoButton>
            </Link>
          </NeoCard>
        </motion.div>
      </main>
    </div>
  )
}
