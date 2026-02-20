import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { api } from '../../api/client'

export default function InvestorProfile() {
  const { id } = useParams()
  const [investor, setInvestor] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (id) api.get('/investors/' + id).then((r) => setInvestor(r.data)).catch(() => setInvestor(null))
  }, [id])

  if (!investor) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>

  const sectors = (investor.preferredSectors as string[]) || []
  const stages = (investor.preferredStages as string[]) || []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-cream py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <NeoCard className="p-8 mb-8">
          <span className="font-display text-6xl text-terracotta block mb-4">&quot;</span>
          <p className="font-display text-2xl font-bold text-forest-ink">{String(investor.fullName)}</p>
          <p className="font-body text-forest-ink/80 mt-1">{String(investor.firmName || '')}</p>
          <p className="font-body text-lg mt-4 text-forest-ink/90 italic">{String(investor.thesis || 'No thesis.')}</p>
        </NeoCard>
        <div className="flex flex-wrap gap-2 mb-6">
          {sectors.map((s) => <Badge key={s} variant="sector">{s}</Badge>)}
        </div>
        <NeoCard className="p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Ticket Size</h2>
          <p className="font-body text-xl">Rs {Number(investor.ticketMin)}L to Rs {Number(investor.ticketMax)}L</p>
        </NeoCard>
        <NeoCard className="p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Stages</h2>
          <div className="flex flex-wrap gap-2">
            {stages.map((s) => <Badge key={s} variant="stage">{s}</Badge>)}
          </div>
        </NeoCard>
        <NeoButton variant="primary">Send Pitch Request</NeoButton>
      </div>
    </motion.div>
  )
}
