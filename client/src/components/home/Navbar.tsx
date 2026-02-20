import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full bg-[#fffbf8]/85 backdrop-blur-[1rem] border-b border-[#e8e3dc] transition-all duration-300 hover:shadow-[0_0.25rem_1.25rem_rgba(62,53,48,0.08)] px-6 lg:px-[5rem] py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" fill="#d4a574" />
                </svg>
                <div className="flex items-baseline gap-2">
                    <span className="font-display italic font-semibold text-[1.375rem] tracking-tight text-[#3e3530]">NEXUS</span>
                    <span className="text-[#9b918a] text-xs">&middot;</span>
                    <span className="text-[#9b918a] text-xs hidden sm:block">Startup India</span>
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-8">
                <Link to="/#how-it-works" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">How It Works</Link>
                <Link to="/#for-startups" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">For Startups</Link>
                <Link to="/#for-investors" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">For Investors</Link>
                <Link to="/#match-engine" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">Match Engine</Link>
                <Link to="/#success-stories" className="text-[0.875rem] font-medium text-[#6b615b] hover:text-[#d4a574] transition-colors">Success Stories</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/login" className="hidden md:block px-5 py-2 rounded-full border border-[#e8e3dc] text-[#3e3530] text-[0.875rem] font-medium hover:bg-[#f7f4f0] transition-colors">Sign In</Link>
                <Link to="/register" className="px-6 py-2 rounded-full bg-[#d4a574] text-white text-[0.875rem] font-medium shadow-sm hover:shadow-[0_0_1.25rem_rgba(212,165,116,0.4)] transition-all">Get Matched</Link>
            </div>
        </nav>
    );
};
