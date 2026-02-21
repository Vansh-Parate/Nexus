import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Badge } from '../../components/ui/Badge'
import { MatchScoreRing } from '../../components/ui/MatchScoreRing'
import { PdfViewerModal } from '../../components/ui/PdfViewerModal'
import { Sidebar } from '../../components/layout/Sidebar'
import { api } from '../../api/client'
import { useAuthStore } from '../../store/authStore'

// Match score calculation (same as backend)
function computeMatchScore(startup: any, investor: any): number {
  let score = 0
  const sectorMatch = investor?.preferredSectors?.includes(startup?.sector)
  if (sectorMatch) score += 40
  const stageMatch = investor?.preferredStages?.includes(startup?.stage)
  if (stageMatch) score += 30
  const sought = startup?.fundingSought || 0
  const min = investor?.ticketMin || 0
  const max = investor?.ticketMax || 1000
  if (sought >= min && sought <= max) score += 30
  else if (sought >= min * 0.7 && sought <= max * 1.3) score += 15
  return score
}

export default function StartupProfile() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [startup, setStartup] = useState<Record<string, unknown> | null>(null)
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null)
  const [sendingInterest, setSendingInterest] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [interestError, setInterestError] = useState<string | null>(null)
  const [matchScore, setMatchScore] = useState<number | null>(null)

  useEffect(() => {
    if (id) {
      api.get(`/startups/${id}`).then((r) => {
        setStartup(r.data)
        // If user is investor, fetch their profile to calculate match score
        if (user?.role === 'investor') {
          api.get('/investors/me')
            .then((invRes) => {
              const score = computeMatchScore(r.data, invRes.data)
              setMatchScore(score)
            })
            .catch(() => setMatchScore(null))
        }
      }).catch(() => setStartup(null))
    }
  }, [id, user?.role])

  if (!startup) return <div className="min-h-screen flex items-center justify-center font-body">Loading...</div>

  const name = (startup.startupName as string) || 'Startup'
  const initial = name.slice(0, 2).toUpperCase()
  const pitchDeckUrl = (startup.pitchDeckUrl as string | undefined) || undefined
  const traction = startup.traction as any
  const documents = startup.documents as any
  const foundedAt = startup.foundedAt ? new Date(String(startup.foundedAt)) : null
  const createdAt = startup.createdAt ? new Date(String(startup.createdAt)) : null
  const updatedAt = startup.updatedAt ? new Date(String(startup.updatedAt)) : null
  const profileCompletedAt = startup.profileCompletedAt ? new Date(String(startup.profileCompletedAt)) : null
  const userData = (startup.user as any) || {}

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

  const content = (
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

            <NeoCard className="p-6 mb-6">
              <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Company Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-body text-xs text-forest-ink/60 mb-1">Sector</p>
                  <p className="font-body font-semibold text-forest-ink">{String(startup.sector || '—')}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-forest-ink/60 mb-1">Stage</p>
                  <p className="font-body font-semibold text-forest-ink">{String(startup.stage || '—')}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-forest-ink/60 mb-1">Location</p>
                  <p className="font-body font-semibold text-forest-ink">{String(startup.location || '—')}</p>
                </div>
                <div>
                  <p className="font-body text-xs text-forest-ink/60 mb-1">Funding Sought</p>
                  <p className="font-body font-semibold text-forest-ink">₹{Number(startup.fundingSought || 0)}L</p>
                </div>
                {foundedAt && (
                  <div>
                    <p className="font-body text-xs text-forest-ink/60 mb-1">Founded</p>
                    <p className="font-body font-semibold text-forest-ink">{foundedAt.toLocaleDateString()}</p>
                  </div>
                )}
                {profileCompletedAt && (
                  <div>
                    <p className="font-body text-xs text-forest-ink/60 mb-1">Profile Completed</p>
                    <p className="font-body font-semibold text-forest-ink">{profileCompletedAt.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </NeoCard>

            {userData.name && (
              <NeoCard className="p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Contact</h2>
                <p className="font-body text-sm text-forest-ink/80">
                  <span className="text-forest-ink/60">User: </span>
                  {String(userData.name || '—')}
                </p>
              </NeoCard>
            )}

            {(createdAt || updatedAt) && (
              <NeoCard className="p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-forest-ink mb-2">Timeline</h2>
                <div className="space-y-2">
                  {createdAt && (
                    <p className="font-body text-sm text-forest-ink/80">
                      <span className="text-forest-ink/60">Joined: </span>
                      {createdAt.toLocaleDateString()}
                    </p>
                  )}
                  {updatedAt && (
                    <p className="font-body text-sm text-forest-ink/80">
                      <span className="text-forest-ink/60">Last updated: </span>
                      {updatedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </NeoCard>
            )}
          </div>
          <div>
            <NeoCard className="p-6 sticky top-8">
              {matchScore !== null && user?.role === 'investor' ? (
                <MatchScoreRing score={matchScore} size={140} className="mx-auto mb-4" />
              ) : (
                <div className="w-[140px] h-[140px] mx-auto mb-4 flex items-center justify-center rounded-full bg-warm-sand/40 border border-border">
                  <span className="font-display text-2xl font-bold text-forest-ink/60">—</span>
                </div>
              )}
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

  if (user?.role === 'investor') {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 md:ml-[4.5rem] pb-20 md:pb-0 overflow-auto">
          {content}
        </main>
      </div>
    )
  }

  return content
}
