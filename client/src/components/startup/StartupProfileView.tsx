import { motion } from 'motion/react'
import { NeoCard } from '../ui/NeoCard'
import { NeoButton } from '../ui/NeoButton'
import { Badge } from '../ui/Badge'

interface StartupProfile {
  id: string
  startupName?: string
  founderName?: string
  sector?: string
  stage?: string
  location?: string
  pitch?: string
  description?: string
  useOfFunds?: string
  fundingSought?: number
  documents?: { pitchDeck?: string; financials?: string; [k: string]: string | undefined }
  [k: string]: unknown
}

function parseDocuments(doc: unknown): { pitchDeck?: string; financials?: string } {
  if (!doc || typeof doc !== 'object') return {}
  const d = doc as Record<string, unknown>
  return {
    pitchDeck: typeof d.pitchDeck === 'string' ? d.pitchDeck : undefined,
    financials: typeof d.financials === 'string' ? d.financials : undefined,
  }
}

interface StartupProfileViewProps {
  profile: StartupProfile
  onEdit: () => void
}

export function StartupProfileView({ profile, onEdit }: StartupProfileViewProps) {
  const docs = parseDocuments(profile.documents)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Top Section - Founder Name Centered */}
      <div className="text-center space-y-3 pb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-forest-ink">
          {profile.founderName || 'Founder'}
        </h1>
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-display text-2xl text-forest-ink/90">{profile.startupName || 'Startup'}</h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {profile.sector && <Badge variant="sector">{profile.sector}</Badge>}
            {profile.stage && <Badge variant="stage">{profile.stage}</Badge>}
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end">
        <NeoButton variant="outline" onClick={onEdit}>
          Edit Profile
        </NeoButton>
      </div>

      {/* Account Information */}
      <NeoCard className="p-8 hover:shadow-xl transition-shadow duration-200">
        <h3 className="font-display text-xl font-semibold text-forest-ink mb-6">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Startup Name</p>
            <p className="font-medium text-gray-800">{profile.startupName || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Founder Name</p>
            <p className="font-medium text-gray-800">{profile.founderName || '—'}</p>
          </div>
        </div>
      </NeoCard>

      {/* Startup Information */}
      <NeoCard className="p-8 hover:shadow-xl transition-shadow duration-200">
        <h3 className="font-display text-xl font-semibold text-forest-ink mb-6">Startup Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Sector</p>
            <p className="font-medium text-gray-800">{profile.sector || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Stage</p>
            <p className="font-medium text-gray-800">{profile.stage || '—'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500 text-sm mb-1">Location</p>
            <p className="font-medium text-gray-800">{profile.location || '—'}</p>
          </div>
        </div>
      </NeoCard>

      {/* Business Details */}
      <NeoCard className="p-8 hover:shadow-xl transition-shadow duration-200">
        <h3 className="font-display text-xl font-semibold text-forest-ink mb-6">Business Details</h3>
        <div className="space-y-6">
          <div>
            <p className="text-gray-500 text-sm mb-2">One-liner Pitch</p>
            <p className="font-medium text-gray-800 leading-relaxed">{profile.pitch || '—'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-2">Description</p>
            <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
              {profile.description || '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-2">Use of Funds</p>
            <p className="font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
              {profile.useOfFunds || '—'}
            </p>
          </div>
        </div>
      </NeoCard>

      {/* Funding */}
      <NeoCard className="p-8 hover:shadow-xl transition-shadow duration-200">
        <h3 className="font-display text-xl font-semibold text-forest-ink mb-6">Funding</h3>
        <div>
          <p className="text-gray-500 text-sm mb-1">Funding Sought</p>
          <p className="font-medium text-gray-800 text-2xl">₹{profile.fundingSought ?? '—'} Lakhs</p>
        </div>
      </NeoCard>

      {/* Documents */}
      <NeoCard className="p-8 hover:shadow-xl transition-shadow duration-200">
        <h3 className="font-display text-xl font-semibold text-forest-ink mb-6">Documents</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Pitch Deck</p>
            {docs.pitchDeck ? (
              <a
                href={docs.pitchDeck}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-terracotta hover:underline break-all"
              >
                {docs.pitchDeck}
              </a>
            ) : (
              <p className="font-medium text-gray-800">—</p>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Financials</p>
            {docs.financials ? (
              <a
                href={docs.financials}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-terracotta hover:underline break-all"
              >
                {docs.financials}
              </a>
            ) : (
              <p className="font-medium text-gray-800">—</p>
            )}
          </div>
        </div>
      </NeoCard>
    </motion.div>
  )
}
