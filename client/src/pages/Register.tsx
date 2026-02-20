import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import * as Select from '@radix-ui/react-select'
import { NeoButton } from '../components/ui/NeoButton'
import { MatchingIllustration } from '../assets/illustrations/MatchingIllustration'

const SECTORS = ['AgriTech', 'FinTech', 'EdTech', 'CleanEnergy', 'HealthTech', 'D2C', 'DeepTech', 'GovTech', 'SaaS', 'Mobility']
const STAGES = ['Idea', 'MVP', 'Early Revenue', 'Scaling']
const INVESTOR_TYPES = ['Angel', 'VC', 'Family Office', 'Corporate VC']

export default function Register() {
  const [searchParams] = useSearchParams()
  const initialRole = (searchParams.get('role') === 'investor' ? 'investor' : 'startup') as 'startup' | 'investor'
  const [role, setRole] = useState<'startup' | 'investor'>(initialRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    startupName: '',
    founderName: '',
    fullName: '',
    firmName: '',
    email: '',
    password: '',
    sector: '',
    stage: '',
    fundingSought: 50,
    pitch: '',
    location: '',
    investorType: '',
    preferredSectors: [] as string[],
    ticketMin: 10,
    ticketMax: 500,
    preferredStages: [] as string[],
    portfolioSize: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = role === 'startup'
        ? {
            role: 'startup',
            email: form.email,
            password: form.password,
            startupName: form.startupName,
            founderName: form.founderName,
            sector: form.sector,
            stage: form.stage,
            fundingSought: form.fundingSought,
            pitch: form.pitch,
            location: form.location,
          }
        : {
            role: 'investor',
            email: form.email,
            password: form.password,
            fullName: form.fullName,
            firmName: form.firmName || undefined,
            investorType: form.investorType,
            preferredSectors: form.preferredSectors,
            ticketMin: form.ticketMin,
            ticketMax: form.ticketMax,
            preferredStages: form.preferredStages,
            portfolioSize: form.portfolioSize ? Number(form.portfolioSize) : undefined,
          }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      window.location.href = role === 'startup' ? '/startup/profile/edit' : '/investor/dashboard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex"
    >
      {/* Left panel */}
      <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-terracotta via-[#c4622d] to-[#b8865a] text-chalk-white p-8 flex-col justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <h2 className="font-display text-3xl font-bold mb-2 leading-tight">
            {role === 'startup' ? 'Connect with Investors' : 'Discover Startups'}
          </h2>
          <p className="font-body text-base text-chalk-white/90 mb-6 leading-relaxed">
            {role === 'startup' 
              ? 'Join India\'s premier startup-investor matching platform. Get discovered by aligned investors in minutes.'
              : 'Access curated deal flow from India\'s most promising startups. AI-powered matching ensures perfect fit.'}
          </p>
          
          <div className="w-full max-w-[280px] mx-auto mb-6">
            <MatchingIllustration className="w-full h-full opacity-90" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-chalk-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-body font-semibold text-sm">Verified Network</p>
                <p className="font-body text-xs text-chalk-white/80">Authenticated investors and startups only</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-chalk-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-body font-semibold text-sm">AI-Powered Matching</p>
                <p className="font-body text-xs text-chalk-white/80">14-signal compatibility scoring</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-chalk-white text-xs">✓</span>
              </div>
              <div>
                <p className="font-body font-semibold text-sm">Zero Fees</p>
                <p className="font-body text-xs text-chalk-white/80">100% free to register and connect</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 w-full md:w-[60%] bg-chalk-white flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md mx-auto w-full">
          <div className="flex gap-2 mb-8 p-1 bg-warm-sand rounded-lg">
            <button
              type="button"
              onClick={() => setRole('startup')}
              className={`flex-1 font-body py-2.5 rounded-lg transition-colors ${
                role === 'startup' ? 'bg-terracotta text-chalk-white' : 'text-forest-ink hover:bg-warm-sand'
              }`}
            >
              🚀 Startup
            </button>
            <button
              type="button"
              onClick={() => setRole('investor')}
              className={`flex-1 font-body py-2.5 rounded-lg transition-colors ${
                role === 'investor' ? 'bg-terracotta text-chalk-white' : 'text-forest-ink hover:bg-warm-sand'
              }`}
            >
              💼 Investor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="font-body text-sm text-clay-red bg-clay-red/10 border border-clay-red/30 p-2 rounded-lg">
                {error}
              </p>
            )}

            {role === 'startup' && (
              <>
                <input
                  required
                  placeholder="Startup Name"
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.startupName}
                  onChange={(e) => setForm((f) => ({ ...f, startupName: e.target.value }))}
                />
                <input
                  required
                  placeholder="Founder Name"
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.founderName}
                  onChange={(e) => setForm((f) => ({ ...f, founderName: e.target.value }))}
                />
              </>
            )}

            {role === 'investor' && (
              <>
                <input
                  required
                  placeholder="Full Name"
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                />
                <input
                  placeholder="Firm Name (optional)"
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.firmName}
                  onChange={(e) => setForm((f) => ({ ...f, firmName: e.target.value }))}
                />
              </>
            )}

            <input
              required
              type="email"
              placeholder="Email"
              className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />

            {role === 'startup' && (
              <>
                <select
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.sector}
                  onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                >
                  <option value="">Industry Sector</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, stage: s }))}
                      className={`font-body text-sm px-3 py-1.5 border border-border rounded-lg ${
                        form.stage === s ? 'bg-terracotta text-chalk-white' : 'bg-chalk-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <label className="font-body text-sm block">
                  Funding Sought (₹L): {form.fundingSought}
                  <input
                    type="range"
                    min="10"
                    max="500"
                    className="w-full mt-1 accent-terracotta"
                    value={form.fundingSought}
                    onChange={(e) => setForm((f) => ({ ...f, fundingSought: Number(e.target.value) }))}
                  />
                </label>
                <div>
                  <textarea
                    placeholder="One-liner Pitch (max 160 chars)"
                    maxLength={160}
                    className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white resize-none"
                    rows={3}
                    value={form.pitch}
                    onChange={(e) => setForm((f) => ({ ...f, pitch: e.target.value }))}
                  />
                  <span className="font-body text-xs text-forest-ink/70">{form.pitch.length}/160</span>
                </div>
                <input
                  placeholder="Location (State)"
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                />
              </>
            )}

            {role === 'investor' && (
              <>
                <div className="flex flex-wrap gap-2">
                  {INVESTOR_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, investorType: t }))}
                      className={`font-body text-sm px-3 py-1.5 border border-border rounded-lg ${
                        form.investorType === t ? 'bg-terracotta text-chalk-white' : 'bg-chalk-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <label className="font-body text-sm block">
                  Ticket Range: ₹{form.ticketMin}L – ₹{form.ticketMax}L
                  <div className="flex gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg"
                      value={form.ticketMin}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          ticketMin: e.target.value === '' ? 0 : Number(e.target.value),
                        }))
                      }
                    />
                    <input
                      type="number"
                      min="0"
                      className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg"
                      value={form.ticketMax}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          ticketMax: e.target.value === '' ? 0 : Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </label>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          preferredStages: f.preferredStages.includes(s)
                            ? f.preferredStages.filter((x) => x !== s)
                            : [...f.preferredStages, s],
                        }))
                      }
                      className={`font-body text-sm px-3 py-1.5 border border-border rounded-lg ${
                        form.preferredStages.includes(s) ? 'bg-terracotta text-chalk-white' : 'bg-chalk-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Portfolio Size (optional)"
                  className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg bg-chalk-white"
                  value={form.portfolioSize}
                  onChange={(e) => setForm((f) => ({ ...f, portfolioSize: e.target.value }))}
                />
              </>
            )}

            <NeoButton type="submit" variant="primary" className="w-full mt-6" disabled={loading}>
              {loading ? 'Creating...' : 'Create My Profile →'}
            </NeoButton>
          </form>

          <p className="font-body text-sm mt-6 text-center text-forest-ink/80">
            Already have an account? <Link to="/login" className="underline text-terracotta">Login</Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
