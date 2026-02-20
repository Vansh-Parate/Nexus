import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Sidebar } from '../../components/layout/Sidebar'
import { api } from '../../api/client'

const SECTORS = ['EdTech', 'FinTech', 'HealthTech', 'SaaS', 'AgriTech', 'D2C']
const STAGES = ['Idea', 'MVP', 'Early Revenue', 'Scaling']

export default function InvestorEditProfile() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    api.get('/investors/me').then((r) => setProfile(r.data)).catch(() => setProfile(null))
  }, [])

  const handleSave = async () => {
    if (!profile?.id) return
    setSaving(true)
    await api.patch('/investors/' + profile.id, profile)
    setLastSaved('Just now')
    setSaving(false)
  }

  const toggleSector = (s: string) => {
    const arr = (profile?.preferredSectors as string[]) || []
    setProfile((p) => ({ ...p, preferredSectors: arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s] }))
  }
  const toggleStage = (s: string) => {
    const arr = (profile?.preferredStages as string[]) || []
    setProfile((p) => ({ ...p, preferredStages: arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s] }))
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  const prefSectors = (profile.preferredSectors as string[]) || []
  const prefStages = (profile.preferredStages as string[]) || []

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-[4.5rem] p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[720px] mx-auto">
          <h1 className="font-display text-3xl font-bold text-forest-ink mb-8">Edit Profile</h1>
          <NeoCard className="p-8">
            <h2 className="font-display text-2xl font-bold text-forest-ink mb-4">Basic Info</h2>
            <hr className="border-t border-dashed border-border mb-6" />
            <div className="space-y-4">
              <input className="w-full font-body px-3 py-2 border border-border rounded-lg" placeholder="Full Name" value={String(profile.fullName || '')} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} />
              <input className="w-full font-body px-3 py-2 border border-border rounded-lg" placeholder="Firm Name" value={String(profile.firmName || '')} onChange={(e) => setProfile((p) => ({ ...p, firmName: e.target.value }))} />
            </div>
            <h2 className="font-display text-2xl font-bold text-forest-ink mt-8 mb-4">Preferences</h2>
            <hr className="border-t border-dashed border-border mb-6" />
            <p className="font-body text-sm mb-2">Preferred Sectors</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {SECTORS.map((s) => (
                <button key={s} type="button" className={'font-body text-sm px-3 py-1.5 border border-border rounded-lg ' + (prefSectors.includes(s) ? 'bg-terracotta text-chalk-white' : '')} onClick={() => toggleSector(s)}>{s}</button>
              ))}
            </div>
            <p className="font-body text-sm mb-2">Preferred Stages</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {STAGES.map((s) => (
                <button key={s} type="button" className={'font-body text-sm px-3 py-1.5 border border-border rounded-lg ' + (prefStages.includes(s) ? 'bg-terracotta text-chalk-white' : '')} onClick={() => toggleStage(s)}>{s}</button>
              ))}
            </div>
            <label className="font-body text-sm block mb-2">Ticket Range (L)</label>
            <div className="flex gap-2 mb-4">
              <input type="number" className="w-full font-body px-3 py-2 border border-border rounded-lg" value={Number(profile.ticketMin) || ''} onChange={(e) => setProfile((p) => ({ ...p, ticketMin: Number(e.target.value) || 0 }))} />
              <input type="number" className="w-full font-body px-3 py-2 border border-border rounded-lg" value={Number(profile.ticketMax) || ''} onChange={(e) => setProfile((p) => ({ ...p, ticketMax: Number(e.target.value) || 0 }))} />
            </div>
            <div className="flex justify-between items-center mt-8">
              <span className="font-body text-xs text-forest-ink/70">{lastSaved ? 'Last saved ' + lastSaved + ' ✓' : ''}</span>
              <NeoButton variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</NeoButton>
            </div>
          </NeoCard>
        </motion.div>
      </main>
    </div>
  )
}
