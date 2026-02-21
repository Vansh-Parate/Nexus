import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/endpoints';
import { NotificationBell } from '../ui/NotificationBell';
import { useWebSocket } from '../../hooks/useWebSocket';
import toast from 'react-hot-toast';

type NavItem = {
  to: string;
  icon: string;
  label: string;
  isActive?: (pathname: string, search: string) => boolean;
};

const navStartup: NavItem[] = [
  { to: '/startup/dashboard', icon: 'solar:widget-linear', label: 'Dashboard' },
  {
    to: '/startup/matches',
    icon: 'solar:users-group-rounded-linear',
    label: 'Matches',
    isActive: (path, search) => path === '/startup/matches' && !search.includes('saved=1'),
  },
  {
    to: '/startup/matches?saved=1',
    icon: 'solar:bookmark-linear',
    label: 'Saved',
    isActive: (path, search) => path === '/startup/matches' && search.includes('saved=1'),
  },
  { to: '/startup/requests', icon: 'solar:chat-round-line-linear', label: 'Requests' },
];

const navInvestor: NavItem[] = [
  { to: '/investor/dashboard', icon: 'solar:widget-linear', label: 'Dashboard' },
  { to: '/investor/matches', icon: 'solar:users-group-rounded-linear', label: 'Matches' },
  { to: '/investor/requests', icon: 'solar:chat-round-line-linear', label: 'Requests' },
];

export function Sidebar() {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = user?.role === 'startup' ? navStartup : navInvestor;
  const profileLink = user?.role === 'startup' ? '/startup/profile/edit' : '/investor/profile/edit';

  // Connect WebSocket at the app level (Sidebar is always mounted for auth'd users)
  useWebSocket((msg) => {
    // Show toast for important events globally
    if (msg.notification) {
      const { type, message } = msg.notification
      if (type === 'new_request') {
        toast(message, {
          icon: '📩',
          style: { background: '#fffbf8', color: '#3e3530', border: '1px solid #e8e3dc' },
        })
      } else if (type === 'request_accepted') {
        toast.success(message, {
          style: { background: '#fffbf8', color: '#3e3530', border: '1px solid #7a9b76' },
        })
      } else if (type === 'request_declined') {
        toast(message, {
          icon: '❌',
          style: { background: '#fffbf8', color: '#3e3530', border: '1px solid #c77567' },
        })
      }
    }
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_) { /* ignore */ }
    logoutStore();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 w-full h-16 bg-[#f7f4f0] border-t border-[#e8e3dc] z-30 flex flex-row justify-around items-center md:top-0 md:left-0 md:w-[4.5rem] md:h-screen md:flex-col md:justify-start md:border-t-0 md:border-r md:py-5 transition-all duration-300">
      {/* Logo */}
      <NavLink to="/" className="hidden md:flex flex-col items-center justify-center mb-6 select-none group">
        <img src="/logo.jpeg" alt="NEXUS" className="w-8 h-8 rounded-lg object-cover group-hover:scale-110 transition-transform" />
      </NavLink>

      {/* Main Nav */}
      <div className="flex flex-row md:flex-col gap-1 md:gap-1 w-full px-2 md:px-0 items-center justify-center">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            isActive={item.isActive ? (_, loc) => item.isActive!(loc.pathname, loc.search) : undefined}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-14 h-14 md:w-full md:h-auto md:py-2.5 rounded-xl transition-all duration-200 relative ${isActive
                ? 'bg-[#e8e3dc] text-[#d4a574]'
                : 'text-[#9b918a] hover:bg-[#e8e3dc]/50 hover:text-[#3e3530]'
              }`
            }
          >
            <Icon icon={item.icon} className="text-[1.2rem]" strokeWidth="1.5" />
            <span className="text-[0.6rem] font-medium leading-none tracking-wide hidden md:block">{item.label}</span>
          </NavLink>
        ))}

        {/* Notification Bell */}
        <NotificationBell />
      </div>

      {/* Bottom section — Profile, Logout */}
      <div className="hidden md:flex flex-col gap-1 mt-auto items-center w-full">
        <NavLink
          to={profileLink}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-full py-2.5 rounded-xl transition-all duration-200 ${isActive
              ? 'bg-[#e8e3dc] text-[#d4a574]'
              : 'text-[#9b918a] hover:bg-[#e8e3dc]/50 hover:text-[#3e3530]'
            }`
          }
        >
          <Icon icon="solar:user-rounded-linear" className="text-[1.2rem]" strokeWidth="1.5" />
          <span className="text-[0.6rem] font-medium leading-none tracking-wide">Profile</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-0.5 w-full py-2.5 rounded-xl text-[#9b918a] hover:bg-[#c77567]/10 hover:text-[#c77567] transition-all duration-200 mb-2"
        >
          <Icon icon="solar:logout-2-linear" className="text-[1.2rem]" strokeWidth="1.5" />
          <span className="text-[0.6rem] font-medium leading-none tracking-wide">Logout</span>
        </button>
      </div>
    </nav>
  );
}
