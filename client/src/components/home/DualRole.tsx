import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

export const DualRole = () => {
    return (
        <section id="for-startups" className="relative min-h-[80vh] flex flex-col lg:flex-row scroll-mt-28">

            {/* Left (Startups) */}
            <div className="w-full lg:w-1/2 bg-[#3e3530] lg:[clip-path:polygon(0_0,95%_0,100%_100%,0_100%)] p-12 lg:p-[7.5rem] flex items-center relative z-10">
                <div className="max-w-[30rem] ml-auto lg:mr-12">
                    <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#d4a574] mb-4 block">For Startups</span>
                    <h2 className="font-display font-semibold text-[2.5rem] lg:text-[3rem] text-[#fffbf8] mb-8 leading-[1.1] tracking-tight">Build once.<br />Discover everywhere.</h2>

                    <ul className="flex flex-col gap-4 mb-10 text-[1.0625rem] text-[#fffbf8]/80 font-light">
                        <li className="flex items-start gap-3"><span className="text-[#d4a574]">&mdash;</span> Structured pitch profile with 12-field intake</li>
                        <li className="flex items-start gap-3"><span className="text-[#d4a574]">&mdash;</span> Visibility score showing profile completeness</li>
                        <li className="flex items-start gap-3"><span className="text-[#d4a574]">&mdash;</span> Live match feed with investor alignment %</li>
                        <li className="flex items-start gap-3"><span className="text-[#d4a574]">&mdash;</span> One-click connection request with intro message</li>
                    </ul>

                    <Link to="/register?role=startup" className="px-8 py-4 rounded-full bg-[#d4a574] text-white font-medium hover:bg-[#b8865a] transition-colors flex items-center justify-center gap-2">
                        Register Your Startup <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" />
                    </Link>
                </div>
            </div>

            {/* Right (Investors) */}
            <div id="for-investors" className="w-full lg:w-1/2 bg-[#fffbf8] p-12 lg:p-[7.5rem] flex items-center scroll-mt-28">
                <div className="max-w-[30rem] mr-auto lg:ml-12">
                    <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#7a9b76] mb-4 block">For Investors</span>
                    <h2 className="font-display font-semibold text-[2.5rem] lg:text-[3rem] text-[#3e3530] mb-8 leading-[1.1] tracking-tight">Filter once.<br />Match always.</h2>

                    <ul className="flex flex-col gap-4 mb-10 text-[1.0625rem] text-[#6b615b] font-light">
                        <li className="flex items-start gap-3"><span className="text-[#7a9b76]">&mdash;</span> Preference dashboard: sector, stage, ticket, geo</li>
                        <li className="flex items-start gap-3"><span className="text-[#7a9b76]">&mdash;</span> AI-ranked startup feed by alignment score</li>
                        <li className="flex items-start gap-3"><span className="text-[#7a9b76]">&mdash;</span> Batch review with swipe-style sorting</li>
                        <li className="flex items-start gap-3"><span className="text-[#7a9b76]">&mdash;</span> Deal room for document exchange</li>
                    </ul>

                    <Link to="/register?role=investor" className="px-8 py-4 rounded-full border-[1.5px] border-[#3e3530] text-[#3e3530] font-medium hover:bg-[#f7f4f0] transition-colors flex items-center justify-center gap-2">
                        Set Investor Preferences <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" />
                    </Link>
                </div>
            </div>

            {/* Center Overlay Badge */}
            <div className="hidden lg:flex absolute top-1/2 left-[48%] -translate-x-1/2 -translate-y-1/2 z-20 glass-card p-4 rounded-xl items-center gap-4 w-[20rem]">
                <div className="flex-1">
                    <p className="text-[0.75rem] text-[#6b615b] mb-1">Potential Match</p>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-[#3e3530] rounded-full flex items-center justify-center text-white text-[0.5rem]">S</div>
                        <span className="text-[0.875rem] font-medium">FinTech Pro</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#d4a574] rounded-full flex items-center justify-center text-white text-[0.5rem]">V</div>
                        <span className="text-[0.875rem] font-medium">VEGA Capital</span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#d4a574] flex items-center justify-center bg-[#fffbf8]">
                    <span className="font-display font-semibold text-[0.875rem] text-[#3e3530]">87%</span>
                </div>
            </div>
        </section>
    );
};
