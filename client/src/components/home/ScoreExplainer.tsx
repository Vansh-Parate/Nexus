import React from 'react';

export const ScoreExplainer = () => {
    return (
        <section className="bg-[#f7f4f0] py-[6.25rem] px-6 lg:px-[5rem]">
            <div className="max-w-[80rem] mx-auto bg-white rounded-[1rem] shadow-sm border border-[#e8e3dc] overflow-hidden flex flex-col lg:flex-row">

                {/* Visual Left */}
                <div className="w-full lg:w-[40%] bg-[#fffbf8] p-8 border-b lg:border-b-0 lg:border-r border-[#e8e3dc] flex items-center justify-center relative min-h-[20rem]">
                    <div className="relative w-[18rem] h-[18rem]">
                        {/* Chart Rings */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                            {/* Ring 1 */}
                            <circle cx="100" cy="100" r="90" fill="none" stroke="var(--surface-dark)" strokeWidth="4"></circle>
                            <circle cx="100" cy="100" r="90" fill="none" stroke="var(--primary-gold)" strokeWidth="4" strokeDasharray="537 565"></circle>
                            {/* Ring 2 */}
                            <circle cx="100" cy="100" r="75" fill="none" stroke="var(--surface-dark)" strokeWidth="4"></circle>
                            <circle cx="100" cy="100" r="75" fill="none" stroke="#7a9b76" strokeWidth="4" strokeDasharray="415 471"></circle>
                            {/* Ring 3 */}
                            <circle cx="100" cy="100" r="60" fill="none" stroke="var(--surface-dark)" strokeWidth="4"></circle>
                            <circle cx="100" cy="100" r="60" fill="none" stroke="#d89b6a" strokeWidth="4" strokeDasharray="286 376"></circle>
                        </svg>

                        {/* Labels (Absolute positioned based on rings) */}
                        <div className="absolute top-[5%] left-[50%] -translate-x-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center shadow-sm border border-[#e8e3dc]">
                            <span className="block text-[0.6875rem] font-medium text-[#6b615b]">Sector</span>
                            <span className="block font-display font-semibold text-[1.125rem] text-[#d4a574] leading-none">95%</span>
                        </div>
                        <div className="absolute top-[20%] right-[-5%] bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center shadow-sm border border-[#e8e3dc]">
                            <span className="block text-[0.6875rem] font-medium text-[#6b615b]">Stage Fit</span>
                            <span className="block font-display font-semibold text-[1.125rem] text-[#7a9b76] leading-none">88%</span>
                        </div>
                        <div className="absolute bottom-[25%] left-[-5%] bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-center shadow-sm border border-[#e8e3dc]">
                            <span className="block text-[0.6875rem] font-medium text-[#6b615b]">Ticket</span>
                            <span className="block font-display font-semibold text-[1.125rem] text-[#d89b6a] leading-none">76%</span>
                        </div>
                    </div>
                </div>

                {/* Copy Right */}
                <div className="w-full lg:w-[60%] p-8 lg:p-12">
                    <h3 className="font-display font-semibold text-[2rem] lg:text-[2.25rem] text-[#3e3530] mb-6 tracking-tight">A score built on 14 weighted signals</h3>
                    <div className="text-[#6b615b] font-light text-[1.0625rem] leading-[1.7] space-y-4 mb-8">
                        <p>Our matchmaking engine doesn't rely on simple keyword matching. It analyzes the deep structural alignment between a startup's current trajectory and an investor's historical and stated preferences.</p>
                        <p>By processing quantitative data (ticket sizes, runway, valuation expectations) alongside qualitative markers (ESG goals, geographic focus, sector nuances), Nexus computes a holistic compatibility score.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">Sector Overlap</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">Stage Compatibility</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">Ticket Size</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">Geography Focus</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">ESG Alignment</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">Traction Velocity</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">Cap Table Structure</span>
                        <span className="px-3 py-1.5 bg-[#e8e3dc]/50 rounded-full text-[0.6875rem] font-medium text-[#3e3530]">+ 7 more signals</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
