import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { NeoCard } from '../../components/ui/NeoCard'
import { NeoButton } from '../../components/ui/NeoButton'
import { Sidebar } from '../../components/layout/Sidebar'
import { ProfileProgressBar } from '../../components/ui/ProfileProgressBar'
import { StartupProfileView } from '../../components/startup/StartupProfileView'
import { api } from '../../api/client'

const SECTORS = ['AgriTech', 'FinTech', 'EdTech', 'CleanEnergy', 'HealthTech', 'D2C', 'DeepTech', 'GovTech', 'SaaS', 'Mobility']
const STAGES = ['Idea', 'MVP', 'Early Revenue', 'Scaling']

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
  traction?: Record<string, unknown>
  documents?: { pitchDeck?: string; financials?: string; [k: string]: string | undefined }
  foundedAt?: string
  profileCompletedAt?: string
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

export default function StartupEditProfile() {
  const [profile, setProfile] = useState<StartupProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    api
      .get('/startups/me')
      .then((r) => {
        setProfile(r.data)
        const p = r.data as StartupProfile
        const completed = new Set<number>()
        if (p?.startupName && p?.founderName) completed.add(0)
        if (p?.sector && p?.stage) completed.add(1)
        if (p?.pitch || p?.description) completed.add(2)
        if (typeof p?.fundingSought === 'number' && p.fundingSought > 0) completed.add(3)
        const docs = parseDocuments(p?.documents)
        if (docs.pitchDeck || docs.financials) completed.add(4)
        if (completed.size >= 4) completed.add(5)
        setCompletedSteps(completed)
        if (p?.profileCompletedAt) {
          setCurrentStep(6)
          setSubmitted(true)
          completed.add(6)
        }
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  const saveStep = async (stepData: Partial<StartupProfile>) => {
    if (!profile?.id) return
    setSaving(true)
    try {
      const res = await api.patch(`/startups/${profile.id}`, { ...profile, ...stepData })
      setProfile((p) => (p ? { ...p, ...res.data } : null))
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      return true
    } catch {
      return false
    } finally {
      setSaving(false)
    }
  }

  const goNext = async () => {
    if (!profile) return
    const isValid = validateStep()
    if (!isValid) return
    const payload = currentStep === 6
      ? { ...profile, profileCompletedAt: new Date().toISOString() }
      : profile
    const ok = await saveStep(payload)
    if (!ok) return
    if (currentStep === 6) {
      setSubmitted(true)
      setCompletedSteps((prev) => new Set([...prev, 6]))
    } else {
      setCurrentStep((s) => Math.min(s + 1, 6))
    }
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
  
    if (currentStep === 0) {
      if (!profile?.startupName?.trim()) {
        newErrors.startupName = "Startup name is required"
      }
      if (!profile?.founderName?.trim()) {
        newErrors.founderName = "Founder name is required"
      }
    }
  
    if (currentStep === 1) {
      if (!profile?.sector) {
        newErrors.sector = "Sector is required"
      }
      if (!profile?.stage) {
        newErrors.stage = "Stage is required"
      }
      if (!profile?.location?.trim()) {
        newErrors.location = "Location is required"
      }
    }
  
    if (currentStep === 2) {
      if (!profile?.pitch?.trim()) {
        newErrors.pitch = "Pitch is required"
      }
      if (!profile?.description?.trim()) {
        newErrors.description = "Description is required"
      }
    }
  
    if (currentStep === 3) {
      if (!profile?.fundingSought || profile.fundingSought <= 0) {
        newErrors.fundingSought = "Funding amount is required"
      }
    }
  
    if (currentStep === 4) {
      const docs = parseDocuments(profile?.documents)
      if (!docs.pitchDeck) {
        newErrors.pitchDeck = "Pitch deck link is required"
      }
    }
  
    setErrors(newErrors)
  
    return Object.keys(newErrors).length === 0
  }

  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0))

  const goToStep = (step: number) => {
    const canGoBack = step <= currentStep
    const canGoForward = step === currentStep + 1 && completedSteps.has(currentStep)
    if (canGoBack || canGoForward) setCurrentStep(step)
  }

  const handleEdit = () => {
    setSubmitted(false)
    setCurrentStep(0)
  }

  if (loading || !profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-forest-ink/80">Loading...</p>
      </div>
    )

  // Render professional profile view when submitted
  if (submitted) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pl-[240px] p-8 overflow-auto">
          <StartupProfileView profile={profile} onEdit={handleEdit} />
        </main>
      </div>
    )
  }

  // Render wizard when not submitted
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 pl-[240px] p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[720px] mx-auto"
        >
          <h1 className="font-display text-3xl font-bold text-forest-ink mb-2">Complete Your Profile</h1>
          <p className="font-body text-sm text-forest-ink/70 mb-6">
            Fill in each section and click Next to save. You can always come back to edit.
          </p>

          <NeoCard className="p-4 mb-8">
            <ProfileProgressBar
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={(step) => goToStep(step)}
            />
          </NeoCard>

          <NeoCard className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Account</h2>
                  <hr className="border-t border-dashed border-border" />
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Startup Name
                    </label>
                    <input
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.startupName ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Your startup name"
                      value={String(profile.startupName || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, startupName: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, startupName: "" }))
                      }}
                    />
                    {errors.startupName && (
                      <p className="text-red-500 text-xs mt-1">{errors.startupName}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Founder Name</label>
                    <input
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.founderName ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Your name"
                      value={String(profile.founderName || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, founderName: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, founderName: "" }))
                      }}
                    />
                    {errors.founderName && (
                      <p className="text-red-500 text-xs mt-1">{errors.founderName}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="startup-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Startup Info</h2>
                  <hr className="border-t border-dashed border-border" />
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Sector</label>
                    <select
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.sector ? 'border-red-500' : 'border-border'
                      }`}
                      value={String(profile.sector || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, sector: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, sector: "" }))
                      }}
                    >
                      <option value="">Select sector</option>
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.sector && (
                      <p className="text-red-500 text-xs mt-1">{errors.sector}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Stage</label>
                    <div className="flex flex-wrap gap-2">
                      {STAGES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setProfile((p) => (p ? { ...p, stage: s } : null))}
                          className={`font-body text-sm px-3 py-1.5 border rounded-lg ${
                            profile.stage === s ? 'bg-terracotta text-chalk-white border-terracotta' : 'border-border'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors.stage && (
                      <p className="text-red-500 text-xs mt-1">{errors.stage}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Location (e.g. State)</label>
                    <input
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.location ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Mumbai, Maharashtra"
                      value={String(profile.location || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, location: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, location: "" }))
                      }}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="business"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Business Details</h2>
                  <hr className="border-t border-dashed border-border" />
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">One-liner Pitch</label>
                    <textarea
                      className={`w-full font-body px-3 py-2 border rounded-lg min-h-[80px] ${
                        errors.pitch ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Summarize your startup in one line"
                      value={String(profile.pitch || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, pitch: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, pitch: "" }))
                      }}
                    />
                    {errors.pitch && (
                      <p className="text-red-500 text-xs mt-1">{errors.pitch}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">About / Description</label>
                    <textarea
                      className={`w-full font-body px-3 py-2 border rounded-lg min-h-[100px] ${
                        errors.description ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Describe your startup, problem, and solution"
                      value={String(profile.description || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, description: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, description: "" }))
                      }}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Use of Funds</label>
                    <textarea
                      className={`w-full font-body px-3 py-2 border rounded-lg min-h-[80px] ${
                        errors.useOfFunds ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="How will you use the funding?"
                      value={String(profile.useOfFunds || '')}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, useOfFunds: e.target.value } : null))
                        setErrors((prev) => ({ ...prev, useOfFunds: "" }))
                      }}
                    />
                    {errors.useOfFunds && (
                      <p className="text-red-500 text-xs mt-1">{errors.useOfFunds}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="funding"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Funding</h2>
                  <hr className="border-t border-dashed border-border" />
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Funding Sought (₹ Lakhs)</label>
                    <input
                      type="number"
                      min={1}
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.fundingSought ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="e.g. 50"
                      value={profile.fundingSought ?? ''}
                      onChange={(e) => {
                        setProfile((p) => (p ? { ...p, fundingSought: Number(e.target.value) || 0 } : null))
                        setErrors((prev) => ({ ...prev, fundingSought: "" }))
                      }}
                    />
                    {errors.fundingSought && (
                      <p className="text-red-500 text-xs mt-1">{errors.fundingSought}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Documents</h2>
                  <hr className="border-t border-dashed border-border" />
                  <p className="font-body text-sm text-forest-ink/70">
                    Add links to your pitch deck and financial documents (Google Drive, Dropbox, etc.)
                  </p>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Pitch Deck URL</label>
                    <input
                      type="url"
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.pitchDeck ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="https://..."
                      value={parseDocuments(profile.documents).pitchDeck || ''}
                      onChange={(e) => {
                        setProfile((p) =>
                          p
                            ? {
                                ...p,
                                documents: {
                                  ...parseDocuments(p.documents),
                                  pitchDeck: e.target.value || undefined,
                                },
                              }
                            : null
                        )
                        setErrors((prev) => ({ ...prev, pitchDeck: "" }))
                      }}
                    />
                    {errors.pitchDeck && (
                      <p className="text-red-500 text-xs mt-1">{errors.pitchDeck}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-body text-sm text-forest-ink/80 block mb-1">Financials URL</label>
                    <input
                      type="url"
                      className={`w-full font-body px-3 py-2 border rounded-lg ${
                        errors.financials ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="https://..."
                      value={parseDocuments(profile.documents).financials || ''}
                      onChange={(e) => {
                        setProfile((p) =>
                          p
                            ? {
                                ...p,
                                documents: {
                                  ...parseDocuments(p.documents),
                                  financials: e.target.value || undefined,
                                },
                              }
                            : null
                        )
                        setErrors((prev) => ({ ...prev, financials: "" }))
                      }}
                    />
                    {errors.financials && (
                      <p className="text-red-500 text-xs mt-1">{errors.financials}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Review</h2>
                  <hr className="border-t border-dashed border-border" />
                  <div className="grid gap-4 text-sm">
                    <div>
                      <span className="font-medium text-forest-ink/70">Startup:</span> {profile.startupName || '—'}
                    </div>
                    <div>
                      <span className="font-medium text-forest-ink/70">Founder:</span> {profile.founderName || '—'}
                    </div>
                    <div>
                      <span className="font-medium text-forest-ink/70">Sector / Stage:</span>{' '}
                      {profile.sector || '—'} / {profile.stage || '—'}
                    </div>
                    <div>
                      <span className="font-medium text-forest-ink/70">Pitch:</span> {profile.pitch || '—'}
                    </div>
                    <div>
                      <span className="font-medium text-forest-ink/70">Funding sought:</span> ₹{profile.fundingSought ?? '—'}L
                    </div>
                    <div>
                      <span className="font-medium text-forest-ink/70">Documents:</span>{' '}
                      {(parseDocuments(profile.documents).pitchDeck || parseDocuments(profile.documents).financials)
                        ? 'Added'
                        : 'None'}
                    </div>
                  </div>
                  <p className="font-body text-sm text-forest-ink/70">
                    Click Next to submit. You can always edit your profile later.
                  </p>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-display text-2xl font-bold text-forest-ink">Submit</h2>
                  <hr className="border-t border-dashed border-border" />
                  <p className="font-body text-forest-ink/80">
                    Click &quot;Complete&quot; to save your profile. You can continue editing anytime from your
                    dashboard.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-dashed border-border">
              <NeoButton
                variant="outline"
                onClick={currentStep === 0 ? undefined : goPrev}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                Previous
              </NeoButton>
              <NeoButton variant="primary" onClick={goNext} disabled={saving}>
                {saving ? 'Saving...' : currentStep === 6 ? 'Complete' : 'Next →'}
              </NeoButton>
            </div>
          </NeoCard>
        </motion.div>
      </main>
    </div>
  )
}
