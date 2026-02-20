import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { MatchScoreRing } from '../../components/ui/MatchScoreRing'
import { api } from '../../api/client'

export default function StartupProfile() {
  const { id } = useParams()
  const [startup, setStartup] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (id) api.get(`/startups/${id}`).then((r) => setStartup(r.data)).catch(() => setStartup(null))
  }, [id])

  if (!startup) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>

  const name = (startup.startupName as string) || 'Startup'
  const initial = name.slice(0, 2).toUpperCase()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-cream">
      <div className="h-[200px] w-full bg-warm-sand" />
      <div className="max-w-[1280px] mx-auto px-6 -mt-24 relative">
        <div className="flex gap-6 flex-wrap">
          <div className="w-32 h-32 shrink-0 bg-terracotta/90 border border-border rounded-xl flex items-center justify-center font-display text-4xl font-bold text-chalk-white">
            {initial}
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-forest-ink">{name}</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant="stage">{String(startup.stage)}</Badge>
              <Badge variant="sector">{String(startup.sector)}</Badge>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-[1fr_320px] gap-8 mt-10 pb-16">
          <div>
            <NeoCard className="p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-2">The Pitch</h2>
              <p className="font-body text-lg italic text-terracotta">{String(startup.pitch || '—')}</p>
            </NeoCard>
            <NeoCard className="p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-2">About</h2>
              <p className="font-body text-forest-ink/90">{String(startup.description || 'No description.')}</p>
            </NeoCard>
            <NeoCard className="p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-2">The Ask</h2>
              <p className="font-body text-2xl font-bold text-forest-ink">₹{Number(startup.fundingSought)}L sought</p>
              <p className="font-body text-sm mt-2 text-forest-ink/80">{String(startup.useOfFunds || '—')}</p>
            </NeoCard>
          </div>
          <div>
            <NeoCard className="p-6 sticky top-8">
              <MatchScoreRing score={75} size={140} className="mx-auto mb-4" />
              <p className="font-body text-sm text-forest-ink/80">Founder: {String(startup.founderName)}</p>
              <p className="font-body text-sm text-forest-ink/80 mt-1">Location: {String(startup.location || '—')}</p>
              <NeoButton variant="primary" className="w-full mt-6">Connect</NeoButton>
            </NeoCard>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
