import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, FileText, Video, BarChart3 } from 'lucide-react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Sidebar } from '../../components/layout/Sidebar'
import { PdfViewerModal } from '../../components/ui/PdfViewerModal'
import { SuccessIllustration } from '../../assets/illustrations/SuccessIllustration'
import { api } from '../../api/client'

const MESSAGE_MAX = 500

interface InvestorInfo {
  fullName?: string
  firmName?: string
}

interface StartupInfo {
  startupName?: string
  founderName?: string
  sector?: string
  pitch?: string
  fundingSought?: number
  pitchDeckUrl?: string | null
}

export default function SendPitch() {
  const { investorId } = useParams()
  const navigate = useNavigate()
  const [investor, setInvestor] = useState<InvestorInfo | null>(null)
  const [startup, setStartup] = useState<StartupInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [notifyTeam, setNotifyTeam] = useState(false)
  const [sending, setSending] = useState(false)
  const [sentAt, setSentAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadPdfError, setUploadPdfError] = useState<string | null>(null)
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!investorId) return
    Promise.all([
      api.get('/investors/' + investorId).then((r) => setInvestor(r.data)),
      api.get('/startups/me').then((r) => setStartup(r.data)),
    ]).catch(() => setInvestor(null)).finally(() => setLoading(false))
  }, [investorId])

  const handleSend = async () => {
    if (!investorId) return
    setSending(true)
    setError(null)
    try {
      await api.post('/requests', {
        toId: investorId,
        toRole: 'investor',
        message: message.trim() || undefined,
      })
      setSentAt(new Date().toISOString())
      setTimeout(() => {
        navigate('/startup/dashboard', { state: { pitchSent: true } })
      }, 2000)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to send pitch. Try again.')
    } finally {
      setSending(false)
    }
  }

  const pitchCompleteness = startup
    ? [
        !!startup.startupName,
        !!startup.sector,
        !!startup.pitch,
        startup.fundingSought != null && startup.fundingSought > 0,
        !!startup.pitchDeckUrl,
      ].filter(Boolean).length * 20
    : 0

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      setUploadPdfError('Please select a PDF file.')
      return
    }
    setUploadPdfError(null)
    setUploadingPdf(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await api.post('/startups/me/pitch-deck', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = (res.data?.pitchDeckUrl as string) || null
      setStartup((s) => (s ? { ...s, pitchDeckUrl: url } : s))
    } catch (err: any) {
      setUploadPdfError(err?.response?.data?.message || 'Upload failed.')
    } finally {
      setUploadingPdf(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pl-[240px] flex items-center justify-center">
          <p className="font-body text-forest-ink/70">Loading...</p>
        </main>
      </div>
    )
  }

  if (!investor) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pl-[240px] flex items-center justify-center">
          <p className="font-body text-red-500">Investor not found.</p>
          <Link to="/startup/matches" className="ml-2 text-terracotta underline">Back to Matches</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <Sidebar />
      <main className="flex-1 pl-[240px] overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto px-6 py-10 space-y-8"
        >
          {/* Header: Back + Investor */}
          <div className="flex flex-col gap-4">
            <Link
              to="/startup/dashboard"
              className="inline-flex items-center gap-2 font-body text-sm text-forest-ink/80 hover:text-terracotta transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <NeoCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-forest-ink/10 flex items-center justify-center font-display text-2xl font-bold text-forest-ink">
                  {investor.fullName?.charAt(0) ?? '?'}
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-forest-ink">
                    {investor.fullName}
                  </h1>
                  <p className="font-body text-sm text-forest-ink/70">
                    {investor.firmName || 'Independent'}
                  </p>
                </div>
              </div>
            </NeoCard>
          </div>

          {/* Section 1 – Pitch Preview */}
          <NeoCard className="p-6">
            <h2 className="font-display text-lg font-bold text-forest-ink mb-4">
              Pitch preview
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-terracotta/20 flex items-center justify-center font-display font-bold text-terracotta">
                  {startup?.startupName?.charAt(0) ?? '?'}
                </div>
                <div>
                  <p className="font-body font-medium text-forest-ink">
                    {startup?.startupName || 'Your startup'}
                  </p>
                  <p className="font-body text-xs text-forest-ink/70">
                    {startup?.sector || 'Sector'} · {startup?.founderName || 'Founder'}
                  </p>
                </div>
              </div>
              {startup?.pitch && (
                <p className="font-body text-sm text-forest-ink/85 border-l-2 border-terracotta/40 pl-3">
                  {startup.pitch}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-2 text-sm text-forest-ink/70">
                <div className="inline-flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Pitch deck (PDF)
                  </span>
                  {startup?.pitchDeckUrl ? (
                    <button
                      type="button"
                      onClick={() => setPdfViewUrl(startup.pitchDeckUrl!)}
                      className="text-left text-terracotta underline text-xs hover:no-underline"
                    >
                      View pitch deck
                    </button>
                  ) : (
                    <label className="cursor-pointer text-xs text-terracotta underline">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="sr-only"
                        disabled={uploadingPdf}
                        onChange={handlePdfUpload}
                      />
                      {uploadingPdf ? 'Uploading…' : 'Upload PDF'}
                    </label>
                  )}
                  {uploadPdfError && (
                    <span className="text-xs text-red-500">{uploadPdfError}</span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  Financials — Add in profile
                </span>
                <span className="inline-flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  Demo video — Optional
                </span>
              </div>
            </div>
          </NeoCard>

          {/* Section 2 – Optional Message */}
          <NeoCard className="p-6">
            <h2 className="font-display text-lg font-bold text-forest-ink mb-2">
              Optional message
            </h2>
            <p className="font-body text-xs text-forest-ink/60 mb-3">
              Add a personal note for the investor
            </p>
            <textarea
              className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg min-h-[100px] resize-y"
              placeholder="Introduce yourself and why you’re reaching out..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
              maxLength={MESSAGE_MAX}
            />
            <p className="font-body text-xs text-forest-ink/50 mt-1">
              {message.length} / {MESSAGE_MAX}
            </p>
          </NeoCard>

          {/* Section 3 – Visibility */}
          <NeoCard className="p-6">
            <h2 className="font-display text-lg font-bold text-forest-ink mb-4">
              Visibility
            </h2>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-border"
              />
              <span className="font-body text-sm text-forest-ink">
                Share pitch as {isPublic ? 'Public' : 'Private'} for this investor
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTeam}
                onChange={(e) => setNotifyTeam(e.target.checked)}
                className="rounded border-border"
              />
              <span className="font-body text-sm text-forest-ink">
                Notify team members (if multiple co-founders)
              </span>
            </label>
          </NeoCard>

          {/* Section 4 – Send / Cancel */}
          <div className="flex flex-col gap-4">
            {error && (
              <p className="font-body text-sm text-red-500">{error}</p>
            )}
            {sentAt ? (
              <NeoCard className="p-8 border-terracotta/30 bg-terracotta/5 text-center">
                <SuccessIllustration className="mx-auto h-20 w-20 text-terracotta" />
                <p className="font-display font-bold text-terracotta mt-4">Pitch sent successfully</p>
                <p className="font-body text-xs text-forest-ink/70 mt-1">
                  The investor will be notified. Redirecting to dashboard...
                </p>
                <div className="mt-6 pt-6 border-t border-terracotta/20">
                  <p className="font-body text-sm text-forest-ink/80 mb-2">Update your pitch deck for future pitches</p>
                  <label className="inline-flex items-center gap-2 font-body text-sm text-terracotta underline cursor-pointer hover:no-underline">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="sr-only"
                      disabled={uploadingPdf}
                      onChange={handlePdfUpload}
                    />
                    {uploadingPdf ? 'Uploading…' : 'Upload new PDF'}
                  </label>
                  {uploadPdfError && (
                    <p className="font-body text-xs text-red-500 mt-2">{uploadPdfError}</p>
                  )}
                </div>
              </NeoCard>
            ) : (
              <div className="flex gap-3">
                <NeoButton
                  variant="primary"
                  onClick={handleSend}
                  disabled={sending}
                  className="flex-1"
                >
                  {sending ? 'Sending...' : 'Send pitch'}
                </NeoButton>
                <Link to="/startup/matches">
                  <NeoButton variant="outline">Cancel</NeoButton>
                </Link>
              </div>
            )}
          </div>

          {/* Section 5 – Smart Tips */}
          <NeoCard className="p-6 bg-warm-sand/30 border-dashed">
            <h2 className="font-display text-sm font-bold text-forest-ink mb-2">
              Smart tips
            </h2>
            <p className="font-body text-xs text-forest-ink/80">
              Your pitch completeness is <strong>{pitchCompleteness}%</strong>
              {pitchCompleteness < 100
                ? ' – consider updating financials and pitch in your profile for better investor response.'
                : ' – looking good.'}
            </p>
            <p className="font-body text-xs text-forest-ink/70 mt-2">
              Tip: Your pitch could be improved by adding a clear revenue model slide in your deck.
            </p>
          </NeoCard>
        </motion.div>
      </main>
      {pdfViewUrl && (
        <PdfViewerModal
          src={pdfViewUrl}
          onClose={() => setPdfViewUrl(null)}
        />
      )}
    </div>
  )
}
