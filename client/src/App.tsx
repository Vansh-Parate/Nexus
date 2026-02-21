import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'

import StartupDashboard from './pages/startup/Dashboard'
import StartupMatches from './pages/startup/Matches'
import StartupProfile from './pages/startup/Profile'
import StartupEditProfile from './pages/startup/EditProfile'
import StartupRequests from './pages/startup/Requests'
import StartupSendPitch from './pages/startup/SendPitch'

import InvestorDashboard from './pages/investor/Dashboard'
import InvestorMatches from './pages/investor/Matches'
import InvestorProfile from './pages/investor/Profile'
import InvestorEditProfile from './pages/investor/EditProfile'
import InvestorRequests from './pages/investor/Requests'

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: ('startup' | 'investor')[]
}) {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to={user.role === 'startup' ? '/startup/dashboard' : '/investor/dashboard'} replace />
  return <>{children}</>
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/startup/dashboard" element={<ProtectedRoute allowedRoles={['startup']}><StartupDashboard /></ProtectedRoute>} />
      <Route path="/startup/matches" element={<ProtectedRoute allowedRoles={['startup']}><StartupMatches /></ProtectedRoute>} />
      <Route path="/startup/profile/edit" element={<ProtectedRoute allowedRoles={['startup']}><StartupEditProfile /></ProtectedRoute>} />
      <Route path="/startup/profile/:id" element={<StartupProfile />} />
      <Route path="/startup/requests" element={<ProtectedRoute allowedRoles={['startup']}><StartupRequests /></ProtectedRoute>} />
      <Route path="/startup/pitch/send/:investorId" element={<ProtectedRoute allowedRoles={['startup']}><StartupSendPitch /></ProtectedRoute>} />

      <Route path="/investor/dashboard" element={<ProtectedRoute allowedRoles={['investor']}><InvestorDashboard /></ProtectedRoute>} />
      <Route path="/investor/matches" element={<ProtectedRoute allowedRoles={['investor']}><InvestorMatches /></ProtectedRoute>} />
      <Route path="/investor/profile/edit" element={<ProtectedRoute allowedRoles={['investor']}><InvestorEditProfile /></ProtectedRoute>} />
      <Route path="/investor/profile/:id" element={<InvestorProfile />} />
      <Route path="/investor/requests" element={<ProtectedRoute allowedRoles={['investor']}><InvestorRequests /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </div>
  )
}
