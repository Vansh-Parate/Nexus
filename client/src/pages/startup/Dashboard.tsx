import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { api } from '../../api/client'

interface Match {
  id: string
  name: string
  firmName?: string
  preferredSectors: string[]
  ticketMin: number
  ticketMax: number
  preferredStages: string[]
  matchScore: number
}

export default function StartupDashboard() {
  const location = useLocation()
  const pitchSent = (location.state as { pitchSent?: boolean })?.pitchSent
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1280px] mx-auto">
          {pitchSent && (
            <div className="mb-6 p-4 rounded-lg bg-terracotta/15 border border-terracotta/30 text-terracotta font-body text-sm">
              Pitch sent successfully. The investor will review your request.
            </div>
          )}
          <h1 className="font-display text-3xl font-bold text-forest-ink mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Match Score Avg</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">{avgScore}%</p>
              <div className="mt-2 h-2 bg-warm-sand/80 border border-border rounded-lg overflow-hidden">
                <motion.div className="h-full bg-terracotta" initial={{ width: 0 }} animate={{ width: `${avgScore}%` }} transition={{ duration: 0.6 }} />
              </div>
            </NeoCard>
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Investors Matched</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">{matches.length}</p>
            </NeoCard>
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Requests Sent</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">—</p>
            </NeoCard>
            <NeoCard className="p-6">
              <p className="font-body text-sm text-forest-ink/80">Requests Received</p>
              <p className="font-display text-4xl font-bold text-forest-ink mt-1">—</p>
            </NeoCard>
          </div>
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-forest-ink">Your Top Matches</h2>
              <Link to="/startup/matches" className="font-body text-sm text-terracotta underline">View All Matches →</Link>
            </div>
            {loading ? (
              <p className="font-body text-sm text-forest-ink/70">Loading...</p>
            ) : matches.length === 0 ? (
              <NeoCard className="p-12 text-center">
                <p className="font-body text-forest-ink/80">Complete your profile to see matches.</p>
                <Link to="/startup/profile/edit"><NeoButton variant="primary" className="mt-4">Edit Profile</NeoButton></Link>
              </NeoCard>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {matches.slice(0, 3).map((m) => (
                  <NeoCard key={m.id} className="p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-xl font-bold text-forest-ink">{m.name}</h3>
                      <span className="font-body text-sm font-bold bg-terracotta/15 text-terracotta px-2 py-0.5 rounded-md">{m.matchScore}%</span>
                    </div>
                    <p className="font-body text-xs text-forest-ink/70 mb-3">{m.firmName || '—'}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {m.preferredSectors?.slice(0, 3).map((s, i) => <Badge key={`${m.id}-sector-${i}`} variant="stage">{s}</Badge>)}
                    </div>
                    <p className="font-body text-xs text-forest-ink/80">₹{m.ticketMin}L – ₹{m.ticketMax}L</p>
                    <div className="mt-auto pt-4 flex gap-2">
                      <Link to={`/investor/profile/${m.id}`}><NeoButton variant="outline" className="text-sm">View Profile</NeoButton></Link>
                      <Link to={`/startup/pitch/send/${m.id}`}><NeoButton variant="primary" className="text-sm">Send Pitch →</NeoButton></Link>
                    </div>
                  </NeoCard>
                ))}
              </div>
            )}
          </section>
          <NeoCard className="p-6">
            <h3 className="font-display text-xl font-bold text-forest-ink mb-2">Profile Completion</h3>
            <p className="font-body text-sm text-forest-ink/80 mb-2">Your profile is 70% complete</p>
            <div className="h-3 bg-warm-sand/80 border border-border rounded-lg overflow-hidden">
              <div className="h-full w-[70%] bg-terracotta" />
            </div>
          </NeoCard>
        </motion.div>
      </main>
    </div>
  )
}
