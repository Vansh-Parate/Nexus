import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Sidebar } from '../../components/layout/Sidebar'
import { api } from '../../api/client'

export default function StartupEditProfile() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    api.get('/startups/me').then((r) => setProfile(r.data)).catch(() => setProfile(null))
  }, [])

  const handleSave = async () => {
    if (!profile?.id) return
    setSaving(true)
    await api.patch(`/startups/${profile.id}`, profile)
    setLastSaved('Just now')
    setSaving(false)
  }

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pl-[240px] p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[720px] mx-auto">
          <h1 className="font-display text-3xl font-bold text-forest-ink mb-8">Edit Profile</h1>
          <NeoCard className="p-8">
            <h2 className="font-display text-2xl font-bold text-forest-ink mb-4">Basic Info</h2>
            <hr className="border-t border-dashed border-border mb-6" />
            <div className="space-y-4">
              <input className="w-full font-body px-3 py-2 border border-border rounded-lg" placeholder="Startup Name" value={String(profile.startupName || '')} onChange={(e) => setProfile((p) => ({ ...p, startupName: e.target.value }))} />
              <input className="w-full font-body px-3 py-2 border border-border rounded-lg" placeholder="Founder Name" value={String(profile.founderName || '')} onChange={(e) => setProfile((p) => ({ ...p, founderName: e.target.value }))} />
            </div>
            <h2 className="font-display text-2xl font-bold text-forest-ink mt-8 mb-4">Your Pitch</h2>
            <hr className="border-t border-dashed border-border mb-6" />
            <textarea className="w-full font-body px-3 py-2 border border-border rounded-lg min-h-[100px]" placeholder="One-liner pitch" value={String(profile.pitch || '')} onChange={(e) => setProfile((p) => ({ ...p, pitch: e.target.value }))} />
            <h2 className="font-display text-2xl font-bold text-forest-ink mt-8 mb-4">Funding Details</h2>
            <hr className="border-t border-dashed border-border mb-6" />
            <input type="number" className="w-full font-body px-3 py-2 border border-border rounded-lg" placeholder="Funding sought (L)" value={Number(profile.fundingSought) || ''} onChange={(e) => setProfile((p) => ({ ...p, fundingSought: Number(e.target.value) || 0 }))} />
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
