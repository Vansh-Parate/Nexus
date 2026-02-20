import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { MatchScoreRing } from '../../components/ui/MatchScoreRing'
import { PdfViewerModal } from '../../components/ui/PdfViewerModal'
import { api } from '../../api/client'

export default function StartupProfile() {
  const { id } = useParams()
  const [startup, setStartup] = useState<Record<string, unknown> | null>(null)
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null)
  const [sendingInterest, setSendingInterest] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [interestError, setInterestError] = useState<string | null>(null)

  useEffect(() => {
    if (id) api.get(`/startups/${id}`).then((r) => setStartup(r.data)).catch(() => setStartup(null))
  }, [id])

  if (!startup) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>

  const name = (startup.startupName as string) || 'Startup'
  const initial = name.slice(0, 2).toUpperCase()
  const pitchDeckUrl = (startup.pitchDeckUrl as string | undefined) || undefined
  const traction = startup.traction as any
  const documents = startup.documents as any
  const foundedAt = startup.foundedAt ? new Date(String(startup.foundedAt)) : null

  const sendInterest = async () => {
    if (!id || sendingInterest || interestSent) return
    setInterestError(null)
    setSendingInterest(true)
    try {
      await api.post('/requests', { toId: id, toRole: 'startup' })
      setInterestSent(true)
    } catch (err: any) {
      setInterestError(err?.response?.data?.message || 'Failed to send interest. Try again.')
    } finally {
      setSendingInterest(false)
    }
  }

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
            <p className="font-body text-sm text-forest-ink/70 mt-2">
              Founder: <span className="text-forest-ink/90">{String(startup.founderName || '—')}</span>
              {' · '}
              Location: <span className="text-forest-ink/90">{String(startup.location || '—')}</span>
              {foundedAt ? (
                <>
                  {' · '}
                  Founded: <span className="text-forest-ink/90">{foundedAt.toLocaleDateString()}</span>
                </>
              ) : null}
            </p>
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

            <NeoCard className="p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Traction</h2>
              {traction && typeof traction === 'object' ? (
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-warm-sand/40 border border-border">
                    <p className="font-body text-xs text-forest-ink/60">Revenue</p>
                    <p className="font-body font-semibold text-forest-ink">{String(traction.revenue ?? '—')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warm-sand/40 border border-border">
                    <p className="font-body text-xs text-forest-ink/60">Users</p>
                    <p className="font-body font-semibold text-forest-ink">{String(traction.users ?? '—')}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-warm-sand/40 border border-border">
                    <p className="font-body text-xs text-forest-ink/60">Growth</p>
                    <p className="font-body font-semibold text-forest-ink">{String(traction.growth ?? '—')}</p>
                  </div>
                </div>
              ) : (
                <p className="font-body text-sm text-forest-ink/70">—</p>
              )}
            </NeoCard>

            <NeoCard className="p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Pitch deck</h2>
              {pitchDeckUrl ? (
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="font-body text-sm text-forest-ink/70">Pitch deck uploaded</p>
                  <NeoButton variant="outline" className="text-sm" onClick={() => setPdfViewUrl(pitchDeckUrl)}>
                    View PDF
                  </NeoButton>
                </div>
              ) : (
                <p className="font-body text-sm text-forest-ink/70">No pitch deck uploaded.</p>
              )}
              {documents && typeof documents === 'object' && Object.keys(documents).length > 0 && (
                <div className="mt-3">
                  <p className="font-body text-xs text-forest-ink/60 mb-1">Other documents</p>
                  <pre className="text-xs bg-warm-sand/40 border border-border rounded-lg p-3 overflow-auto">{JSON.stringify(documents, null, 2)}</pre>
                </div>
              )}
            </NeoCard>
          </div>
          <div>
            <NeoCard className="p-6 sticky top-8">
              <MatchScoreRing score={75} size={140} className="mx-auto mb-4" />
              <p className="font-body text-sm text-forest-ink/80">Stage: {String(startup.stage || '—')}</p>
              <p className="font-body text-sm text-forest-ink/80 mt-1">Sector: {String(startup.sector || '—')}</p>
              <p className="font-body text-sm text-forest-ink/80 mt-1">Funding sought: ₹{Number(startup.fundingSought || 0)}L</p>
              {interestError && <p className="font-body text-xs text-red-600 mt-3">{interestError}</p>}
              <div className="mt-6 flex flex-col gap-2">
                <NeoButton
                  variant="primary"
                  className="w-full"
                  onClick={sendInterest}
                  disabled={sendingInterest || interestSent}
                >
                  {interestSent ? 'Interest Sent' : sendingInterest ? 'Sending...' : 'Express Interest'}
                </NeoButton>
                <Link to="/investor/matches" className="w-full">
                  <NeoButton variant="outline" className="w-full">Back to Matches</NeoButton>
                </Link>
              </div>
            </NeoCard>
          </div>
        </div>
      </div>
      {pdfViewUrl && <PdfViewerModal src={pdfViewUrl} onClose={() => setPdfViewUrl(null)} />}
    </motion.div>
  )
}
