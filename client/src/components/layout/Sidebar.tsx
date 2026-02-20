import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuthStore } from '../../store/authStore';

const navStartup = [
  { to: '/startup/dashboard', icon: 'solar:widget-linear', label: 'Dashboard' },
  { to: '/startup/matches', icon: 'solar:users-group-rounded-linear', label: 'Matches' },
  { to: '/startup/requests', icon: 'solar:chat-round-line-linear', label: 'Requests', hasIndicator: true },
  { to: '#', icon: 'solar:bookmark-linear', label: 'Saved' },
];

const navInvestor = [
  { to: '/investor/dashboard', icon: 'solar:widget-linear', label: 'Dashboard' },
  { to: '/investor/matches', icon: 'solar:users-group-rounded-linear', label: 'Matches' },
  { to: '/investor/requests', icon: 'solar:chat-round-line-linear', label: 'Requests', hasIndicator: true },
  { to: '#', icon: 'solar:bookmark-linear', label: 'Saved' },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const navItems = user?.role === 'startup' ? navStartup : navInvestor;
  const profileLink = user?.role === 'startup' ? '/startup/profile/edit' : '/investor/profile/edit';

  return (
    <nav className="fixed bottom-0 w-full h-16 bg-[#f7f4f0] border-t border-[#e8e3dc] z-30 flex flex-row justify-around items-center md:top-0 md:left-0 md:w-16 md:h-screen md:flex-col md:justify-start md:border-t-0 md:border-r md:py-6 transition-all duration-300">
      <div className="hidden md:flex font-display text-xl tracking-tighter font-semibold text-[#3e3530] mb-8 select-none">
        FB
      </div>

      <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full px-2 md:px-0 items-center justify-center">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            title={item.label}
            className={({ isActive }) => `w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative ${isActive ? 'bg-[#e8e3dc] text-[#d4a574]' : 'text-[#9b918a] hover:bg-[#e8e3dc]/50 hover:text-[#3e3530]'}`}
          >
            <Icon icon={item.icon} className="text-xl" strokeWidth="1.5" />
            {item.hasIndicator && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#d4a574] hidden"></span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex flex-col gap-4 mt-auto items-center">
        <NavLink
          to={profileLink}
          title="Profile"
          className={({ isActive }) => `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#e8e3dc] text-[#d4a574]' : 'text-[#9b918a] hover:bg-[#e8e3dc]/50 hover:text-[#3e3530]'}`}
        >
          <Icon icon="solar:user-rounded-linear" className="text-xl" strokeWidth="1.5" />
        </NavLink>

        <NavLink
          to="#"
          title="Settings"
          className={({ isActive }) => `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-[#e8e3dc] text-[#d4a574]' : 'text-[#9b918a] hover:bg-[#e8e3dc]/50 hover:text-[#3e3530]'}`}
        >
          <Icon icon="solar:settings-linear" className="text-xl" strokeWidth="1.5" />
        </NavLink>
      </div>
    </nav>
  );
}
