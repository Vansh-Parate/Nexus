import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { Sidebar } from '../../components/layout/Sidebar'
import { api } from '../../api/client'
import { useAuthStore } from '../../store/authStore'

interface Investor {
  fullName?: string
  firmName?: string
  thesis?: string
  preferredSectors?: string[]
  preferredStages?: string[]
  ticketMin?: number
  ticketMax?: number
  experienceYears?: number
  totalInvestments?: number
  exits?: number
}

export default function InvestorProfile() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const isStartupViewer = user?.role === 'startup'
  const [investor, setInvestor] = useState<Investor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    api
      .get('/investors/' + id)
      .then((r) => setInvestor(r.data))
      .catch(() => setInvestor(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex bg-cream">
        {isStartupViewer && <Sidebar />}
        <main className={isStartupViewer ? 'flex-1 pl-[240px]' : 'flex-1'}>
          <div className="flex items-center justify-center min-h-screen font-body text-forest-ink/70">
            Loading investor profile...
          </div>
        </main>
      </div>
    )
  }

  if (!investor) {
    return (
      <div className="min-h-screen flex bg-cream">
        {isStartupViewer && <Sidebar />}
        <main className={isStartupViewer ? 'flex-1 pl-[240px]' : 'flex-1'}>
          <div className="flex items-center justify-center min-h-screen font-body text-red-500">
            Investor not found
          </div>
        </main>
      </div>
    )
  }

  const sectors = investor.preferredSectors || []
  const stages = investor.preferredStages || []

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream py-14"
    >
      <div className="max-w-[1200px] mx-auto px-6 space-y-10">
        {isStartupViewer && (
          <Link
            to="/startup/matches"
            className="inline-flex items-center gap-2 font-body text-sm text-forest-ink/80 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Matches
          </Link>
        )}

        {/* ================= HEADER ================= */}
        <NeoCard className="p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-ink">
                {investor.fullName}
              </h1>

              {investor.firmName && (
                <p className="font-body text-lg text-forest-ink/70 mt-1">
                  {investor.firmName}
                </p>
              )}

              {investor.experienceYears && (
                <p className="font-body text-sm text-forest-ink/60 mt-2">
                  {investor.experienceYears} years investing experience
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm text-forest-ink/60">Investment Range</p>
              <p className="text-xl font-bold text-terracotta">
                ₹{investor.ticketMin}L – ₹{investor.ticketMax}L
              </p>
            </div>
          </div>
        </NeoCard>

        {/* ================= MAIN GRID ================= */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* ===== LEFT SIDE ===== */}
          <div className="md:col-span-2 space-y-8">

            {/* Thesis */}
            <NeoCard className="p-8">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-4">
                Investment Thesis
              </h2>

              <p className="font-body text-forest-ink/85 leading-relaxed">
                {investor.thesis || 'No thesis provided.'}
              </p>
            </NeoCard>

            {/* Preferred Sectors */}
            <NeoCard className="p-8">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-4">
                Preferred Sectors
              </h2>

              <div className="flex flex-wrap gap-2">
                {sectors.length > 0 ? (
                  sectors.map((s, i) => (
                    <Badge key={`sector-${i}-${s}`} variant="sector">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-forest-ink/60">
                    No sector preference listed.
                  </p>
                )}
              </div>
            </NeoCard>

            {/* Preferred Stages */}
            <NeoCard className="p-8">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-4">
                Preferred Stages
              </h2>

              <div className="flex flex-wrap gap-2">
                {stages.length > 0 ? (
                  stages.map((s, i) => (
                    <Badge key={`stage-${i}-${s}`} variant="stage">
                      {s}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-forest-ink/60">
                    No stage preference listed.
                  </p>
                )}
              </div>
            </NeoCard>

          </div>

          {/* ===== RIGHT SIDE SNAPSHOT ===== */}
          <div className="space-y-6">

            <NeoCard className="p-6 text-center">
              <p className="text-xs text-forest-ink/60">Total Investments</p>
              <p className="text-2xl font-bold text-forest-ink">
                {investor.totalInvestments || 0}
              </p>
            </NeoCard>

            <NeoCard className="p-6 text-center">
              <p className="text-xs text-forest-ink/60">Successful Exits</p>
              <p className="text-2xl font-bold text-forest-ink">
                {investor.exits || 0}
              </p>
            </NeoCard>

            <NeoCard className="p-6">
              {isStartupViewer && id ? (
                <Link to={`/startup/pitch/send/${id}`}>
                  <NeoButton variant="primary" className="w-full">
                    Send Pitch Request
                  </NeoButton>
                </Link>
              ) : (
                <NeoButton variant="primary" className="w-full">
                  Send Pitch Request
                </NeoButton>
              )}
            </NeoCard>

          </div>
        </div>
      </div>
    </motion.div>
  )

  if (isStartupViewer) {
    return (
      <div className="min-h-screen flex bg-cream">
        <Sidebar />
        <main className="flex-1 pl-[240px] overflow-auto">
          {content}
        </main>
      </div>
    )
  }

  return content
}
