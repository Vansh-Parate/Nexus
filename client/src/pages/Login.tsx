import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import * as Tabs from '@radix-ui/react-tabs'
import { NeoButton } from '../components/ui/NeoButton'
import { useAuthStore } from '../store/authStore'
import { authApi } from '../api/endpoints'

export default function Login() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)
  const [role, setRole] = useState<'startup' | 'investor'>('startup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(email, password, role)
      const data = res.data
      setUser({
        id: data.user?.id ?? '1',
        email: data.user?.email ?? email,
        name: data.user?.name ?? (role === 'startup' ? 'Startup' : 'Investor'),
        role,
      })
      navigate(role === 'startup' ? '/startup/dashboard' : '/investor/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-cream flex items-center justify-center p-6 relative"
    >
      <div className="absolute inset-0 bg-noise pointer-events-none" aria-hidden />
      <div className="w-full max-w-[480px] bg-chalk-white border border-border rounded-2xl shadow-[var(--shadow-card)] p-8 relative">
        <div className="text-center mb-6">
          <Link to="/" className="font-display text-2xl font-bold text-forest-ink">
            VEGA
          </Link>
          <h1 className="font-display text-3xl font-bold text-forest-ink mt-4">Welcome Back</h1>
        </div>

        <Tabs.Root value={role} onValueChange={(v) => setRole(v as 'startup' | 'investor')}>
          <Tabs.List className="flex gap-0 border border-border rounded-lg p-0.5 mb-6">
            <Tabs.Trigger
              value="startup"
              className="flex-1 font-body text-sm py-2 data-[state=active]:bg-terracotta data-[state=active]:text-chalk-white rounded-md transition-colors"
            >
              Startup
            </Tabs.Trigger>
            <Tabs.Trigger
              value="investor"
              className="flex-1 font-body text-sm py-2 data-[state=active]:bg-terracotta data-[state=active]:text-chalk-white rounded-md transition-colors"
            >
              Investor
            </Tabs.Trigger>
          </Tabs.List>

          <form onSubmit={handleSubmit}>
            {error && (
              <p className="font-body text-sm text-clay-red bg-clay-red/10 border border-clay-red/30 p-2 rounded-lg mb-4">
                {error}
              </p>
            )}
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg mb-4 bg-chalk-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full font-body text-sm px-3 py-2 border border-border rounded-lg mb-2 bg-chalk-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="font-body text-xs mb-4">
              <a href="#" className="underline text-forest-ink">Forgot Password?</a>
            </p>
            <NeoButton type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </NeoButton>
          </form>
        </Tabs.Root>

        <p className="font-body text-sm text-center mt-6 text-forest-ink/80">
          — or —
        </p>
        <div className="font-body text-sm text-center mt-2 space-y-1">
          <p>
            <Link to="/register" className="underline text-terracotta">Create an account</Link>
          </p>
          {role === 'startup' && (
            <p>
              <Link to="/startup/profile/edit" className="underline text-blue-600">Complete your startup profile</Link>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
