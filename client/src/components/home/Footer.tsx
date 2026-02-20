import { Icon } from '@iconify/react';

export const Footer = () => {
    return (
        <footer className="bg-[#2e2926] pt-[5rem] pb-12 px-6 lg:px-[5rem] text-white">
            <div className="max-w-[80rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                {/* Col 1 */}
                <div className="lg:pr-8">
                    <div className="flex items-center gap-2 mb-4">
                        <img src="/logo_2.jpeg" alt="VEGA Logo" className="w-6 h-6 rounded object-cover" />
                        <span className="font-display italic font-semibold text-[1.25rem] tracking-tight">VEGA</span>
                    </div>
                    <p className="text-[0.875rem] text-[#9b918a] font-light leading-relaxed mb-6">The intelligent matchmaking portal powered by the Startup India Initiative. Connecting potential with capital.</p>
                    <div className="flex gap-4 text-[#9b918a]">
                        <a href="#" className="hover:text-white transition-colors"><Icon icon="solar:brand-twitter-linear" className="text-[1.25rem]" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Icon icon="solar:brand-linkedin-linear" className="text-[1.25rem]" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Icon icon="solar:letter-linear" className="text-[1.25rem]" /></a>
                    </div>
                </div>

                {/* Col 2 */}
                <div>
                    <h4 className="text-[0.875rem] font-medium mb-4 text-[#e8c9a0]">Platform</h4>
                    <ul className="flex flex-col gap-3 text-[0.875rem] text-[#9b918a] font-light">
                        <li><a href="#" className="hover:text-white transition-colors">For Startups</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">For Investors</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Match Engine</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                    </ul>
                </div>

                {/* Col 3 */}
                <div>
                    <h4 className="text-[0.875rem] font-medium mb-4 text-[#e8c9a0]">Resources</h4>
                    <ul className="flex flex-col gap-3 text-[0.875rem] text-[#9b918a] font-light">
                        <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    </ul>
                </div>

                {/* Col 4 */}
                <div>
                    <h4 className="text-[0.875rem] font-medium mb-4 text-[#e8c9a0]">Legal</h4>
                    <ul className="flex flex-col gap-3 text-[0.875rem] text-[#9b918a] font-light">
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">DPDP Compliance</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cookie Settings</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-[80rem] mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[0.75rem] text-[#9b918a] font-light">
                <span>&copy; {new Date().getFullYear()} VEGA Matchmaking Portal. All rights reserved.</span>
                <span>Made under Startup India Initiative 🇮🇳</span>
            </div>
        </footer>
    );
};
