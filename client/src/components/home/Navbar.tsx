import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="sticky top-0 z-50 w-full bg-[#fffbf8]/95 backdrop-blur-[1rem] border-b border-[#e8e3dc] transition-all duration-300 hover:shadow-[0_0.25rem_1.25rem_rgba(62,53,48,0.08)] px-4 sm:px-6 lg:px-[5rem] py-3 sm:py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
                <img src="/logo.jpeg" alt="NEXUS Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover" />
                <div className="flex items-baseline gap-2">
                    <span className="font-display italic font-semibold text-[1.125rem] sm:text-[1.375rem] tracking-tight text-[#3e3530]">NEXUS</span>
                    <span className="text-[#9b918a] text-xs">&middot;</span>
                    <span className="text-[#9b918a] text-xs hidden sm:block">Startup India</span>
                </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
                <Link to="/#how-it-works" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">How It Works</Link>
                <Link to="/#for-startups" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">For Startups</Link>
                <Link to="/#for-investors" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">For Investors</Link>
                <Link to="/#match-engine" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">Match Engine</Link>
                <Link to="/#success-stories" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">Success Stories</Link>
            </div>

            {/* Mobile menu */}
            <div className="relative flex items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    className="lg:hidden p-2 rounded-lg text-[#3e3530] hover:bg-[#e8e3dc]/50 transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <Icon icon={menuOpen ? 'solar:close-circle-linear' : 'solar:hamburger-menu-linear'} className="text-2xl" />
                </button>
                {menuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 lg:hidden bg-[#fffbf8] border border-[#e8e3dc] rounded-xl shadow-lg py-3 z-50">
                        <Link to="/#how-it-works" className="block px-4 py-2.5 text-[0.875rem] font-medium text-[#6b615b] hover:bg-[#f7f4f0] hover:text-[#d4a574]" onClick={() => setMenuOpen(false)}>How It Works</Link>
                        <Link to="/#for-startups" className="block px-4 py-2.5 text-[0.875rem] font-medium text-[#6b615b] hover:bg-[#f7f4f0] hover:text-[#d4a574]" onClick={() => setMenuOpen(false)}>For Startups</Link>
                        <Link to="/#for-investors" className="block px-4 py-2.5 text-[0.875rem] font-medium text-[#6b615b] hover:bg-[#f7f4f0] hover:text-[#d4a574]" onClick={() => setMenuOpen(false)}>For Investors</Link>
                        <Link to="/#match-engine" className="block px-4 py-2.5 text-[0.875rem] font-medium text-[#6b615b] hover:bg-[#f7f4f0] hover:text-[#d4a574]" onClick={() => setMenuOpen(false)}>Match Engine</Link>
                        <Link to="/#success-stories" className="block px-4 py-2.5 text-[0.875rem] font-medium text-[#6b615b] hover:bg-[#f7f4f0] hover:text-[#d4a574]" onClick={() => setMenuOpen(false)}>Success Stories</Link>
                    </div>
                )}
                <Link to="/login" className="hidden md:block px-5 py-2 rounded-full border border-[#e8e3dc] text-[#3e3530] text-[0.875rem] font-medium hover:bg-[#f7f4f0] transition-colors">Sign In</Link>
                <Link to="/register" className="px-4 sm:px-6 py-2 rounded-full bg-[#d4a574] text-white text-[0.875rem] font-medium shadow-sm hover:shadow-[0_0_1.25rem_rgba(212,165,116,0.4)] transition-all">Get Matched</Link>
            </div>
        </nav>
    );
};
