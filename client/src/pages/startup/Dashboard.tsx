import { useEffect, useState } from 'react'
import { Sidebar } from '../../components/layout/Sidebar'
import { api, isNetworkError } from '../../api/client'
import {
  StartupSnapshot,
  MatchSummary,
  ReadinessScore,
  BenchmarkBanner,
  RecommendedInvestors,
  ImproveMatchScore,
  TractionSnapshot,
  ActivityMessages,
} from '../../components/startup/dashboard/Widgets'
import { InvestorDetailPanel } from '../../components/startup/dashboard/DetailPanel'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'

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
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedInvestor, setSelectedInvestor] = useState<{ name: string; type: string; score: number } | null>(null)

  const fetchMatches = () => {
    setError(null)
    setLoading(true)
    api
      .get('/matches')
      .then((res) => setMatches(res.data.matches || []))
      .catch((err) => {
        setMatches([])
        setError(
          isNetworkError(err)
            ? 'Server unavailable. Start the backend with `npm run dev` in the server folder.'
            : 'Failed to load matches.'
        )
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const handleOpenPanel = (investor: { name: string; type: string; score: number }) => {
    setSelectedInvestor(investor)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  return (
    <div className="font-body text-[#3e3530] bg-[#fffbf8] flex min-h-screen text-sm antialiased selection:bg-[#e8c9a0] selection:text-[#3e3530] overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 pb-24 md:pb-12 md:ml-16 p-6 md:p-8 xl:p-12 max-w-7xl mx-auto flex flex-col gap-8 w-full transition-all duration-300">
        <section className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <StartupSnapshot />
          <MatchSummary />
          <ReadinessScore />
        </section>

        <BenchmarkBanner />

        {loading ? (
          <p className="font-body text-sm text-forest-ink/70">Loading matches...</p>
        ) : error ? (
          <NeoCard className="p-12 text-center">
            <p className="font-body text-forest-ink/80">{error}</p>
            <NeoButton variant="primary" className="mt-4" onClick={fetchMatches}>
              Retry
            </NeoButton>
          </NeoCard>
        ) : (
          <RecommendedInvestors matches={matches} onOpenPanel={handleOpenPanel} />
        )}

        <ImproveMatchScore />
        <TractionSnapshot />
        <ActivityMessages />
      </main>

      <InvestorDetailPanel isOpen={isPanelOpen} onClose={handleClosePanel} investor={selectedInvestor} />
    </div>
  )
}
