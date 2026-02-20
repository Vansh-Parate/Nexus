import { NavLink, useNavigate } from 'react-router-dom'
import { Home, User, Zap, Handshake, MessageSquare, Settings, LogOut } from 'lucide-react'
import { NeoButton } from '../ui/NeoButton'
import { useAuthStore } from '../../store/authStore'

const navStartup = [
  { to: '/startup/dashboard', label: 'Dashboard', icon: Home },
  { to: '/startup/profile/edit', label: 'My Profile', icon: User },
  { to: '/startup/matches', label: 'Matches', icon: Zap },
  { to: '/startup/requests', label: 'Connection Requests', icon: Handshake },
  { to: '#', label: 'Messages', icon: MessageSquare },
  { to: '#', label: 'Settings', icon: Settings },
]

const navInvestor = [
  { to: '/investor/dashboard', label: 'Dashboard', icon: Home },
  { to: '/investor/profile/edit', label: 'My Profile', icon: User },
  { to: '/investor/matches', label: 'Matches', icon: Zap },
  { to: '/investor/requests', label: 'Connection Requests', icon: Handshake },
  { to: '#', label: 'Messages', icon: MessageSquare },
  { to: '#', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const nav = user?.role === 'startup' ? navStartup : navInvestor

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-forest-ink text-cream flex flex-col z-50">
      <div className="p-4 border-b border-cream/20">
        <NavLink to="/" className="font-display text-xl font-bold text-cream">
          VEGA
        </NavLink>
      </div>
      <nav className="flex-1 py-4">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg font-body text-sm transition-colors ${
                isActive ? 'bg-terracotta/20 text-cream border-l-2 border-terracotta' : 'hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-cream/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-terracotta flex items-center justify-center font-display font-bold text-chalk-white">
            {user?.name?.charAt(0) ?? '?'}
          </div>
          <span className="font-body text-sm truncate">{user?.name}</span>
        </div>
        <NeoButton variant="ghost" className="w-full justify-start text-cream border-cream/30 hover:bg-cream/10" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          Logout
        </NeoButton>
      </div>
    </aside>
  )
}
