import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { EmptyState } from '../../components/ui/EmptyState'
import { CompassIllustration } from '../../assets/illustrations/CompassIllustration'
import { api } from '../../api/client'

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
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')

  useEffect(() => {
    const fetchMatches = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching matches:', error)
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [sector, stage])

  return (
    <div className="min-h-screen flex bg-chalk-white">
      <Sidebar />
      <main className="flex-1 md:ml-[4.5rem] flex">
        <aside className="w-[280px] shrink-0 p-6 border-r border-border bg-warm-sand/40">
          <h2 className="font-display text-2xl font-bold text-forest-ink mb-4">Filter Investors</h2>
          <select className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white mb-4" value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">All Sectors</option>
            <option value="EdTech">EdTech</option>
            <option value="FinTech">FinTech</option>
            <option value="SaaS">SaaS</option>
          </select>
          <select className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white mb-4" value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="">All Stages</option>
            <option value="Idea">Idea</option>
            <option value="MVP">MVP</option>
            <option value="Early Revenue">Early Revenue</option>
            <option value="Scaling">Scaling</option>
          </select>
          <NeoButton variant="primary" className="w-full">Apply Filters</NeoButton>
          <button type="button" className="font-body text-sm mt-2 underline text-forest-ink" onClick={() => { setSector(''); setStage('') }}>Reset</button>
        </aside>
        <div className="flex-1 p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            {loading ? <p className="font-body text-sm">Loading...</p> : matches.length === 0 ? (
              <EmptyState illustration={<CompassIllustration />} message="No matches yet — try broadening your filters" />
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