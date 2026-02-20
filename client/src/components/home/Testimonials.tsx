import { Icon } from '@iconify/react';

export const Testimonials = () => {
    return (
        <section id="success-stories" className="bg-[#3e3530] py-[6.25rem] px-6 lg:px-[5rem] overflow-hidden scroll-mt-28">
            <h2 className="font-display italic font-semibold text-[2.5rem] lg:text-[3.25rem] text-[#fffbf8] mb-12 text-center tracking-tight">"Connections that became companies."</h2>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar max-w-[80rem] mx-auto">

                {/* Card 1 */}
                <div className="min-w-[20rem] lg:min-w-[24rem] w-full max-w-[28rem] snap-center bg-white/5 border border-white/10 rounded-2xl p-8 relative flex flex-col justify-between h-auto">
                    <div className="absolute top-6 right-6 px-3 py-1 bg-[#d4a574]/20 text-[#d4a574] border border-[#d4a574]/30 rounded-full text-[0.6875rem] font-medium">
                        96% Match
                    </div>
                    <p className="font-display italic text-[1.25rem] lg:text-[1.375rem] text-[#e8c9a0] leading-[1.6] mb-8 mt-6">
                        "We had 3 investor meetings in the first week. VEGA understood what we needed before we even explained it."
                    </p>
                    <div>
                        <span className="block text-[0.875rem] text-white font-medium">Aarav Sharma</span>
                        <span className="block text-[0.75rem] text-[#9b918a] mb-4">Founder, EcoLogistics</span>
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                            <span className="text-[0.75rem] text-[#9b918a]">Matched with:</span>
                            <Icon icon="solar:routing-linear" className="text-[#d4a574]" />
                            <span className="text-[0.75rem] text-white">Peak Ventures</span>
                        </div>
                    </div>
                    <div className="mt-4"><span className="px-2 py-1 bg-[#7a9b76]/20 text-[#7a9b76] rounded text-[0.6875rem] border border-[#7a9b76]/30">CleanTech &middot; Pre-Series A</span></div>
                </div>

                {/* Card 2 */}
                <div className="min-w-[20rem] lg:min-w-[24rem] w-full max-w-[28rem] snap-center bg-white/5 border border-white/10 rounded-2xl p-8 relative flex flex-col justify-between h-auto">
                    <div className="absolute top-6 right-6 px-3 py-1 bg-[#d4a574]/20 text-[#d4a574] border border-[#d4a574]/30 rounded-full text-[0.6875rem] font-medium">
                        92% Match
                    </div>
                    <p className="font-display italic text-[1.25rem] lg:text-[1.375rem] text-[#e8c9a0] leading-[1.6] mb-8 mt-6">
                        "The quality of deal flow is exceptional. The AI filters out the noise, presenting only startups that fit our thesis perfectly."
                    </p>
                    <div>
                        <span className="block text-[0.875rem] text-white font-medium">Priya Desai</span>
                        <span className="block text-[0.75rem] text-[#9b918a] mb-4">Partner, Horizon Capital</span>
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                            <span className="text-[0.75rem] text-[#9b918a]">Matched with:</span>
                            <Icon icon="solar:routing-linear" className="text-[#d4a574]" />
                            <span className="text-[0.75rem] text-white">MedAssist AI</span>
                        </div>
                    </div>
                    <div className="mt-4"><span className="px-2 py-1 bg-[#7a9b76]/20 text-[#7a9b76] rounded text-[0.6875rem] border border-[#7a9b76]/30">HealthTech &middot; Seed</span></div>
                </div>

                {/* Card 3 */}
                <div className="min-w-[20rem] lg:min-w-[24rem] w-full max-w-[28rem] snap-center bg-white/5 border border-white/10 rounded-2xl p-8 relative flex flex-col justify-between h-auto">
                    <div className="absolute top-6 right-6 px-3 py-1 bg-[#d4a574]/20 text-[#d4a574] border border-[#d4a574]/30 rounded-full text-[0.6875rem] font-medium">
                        89% Match
                    </div>
                    <p className="font-display italic text-[1.25rem] lg:text-[1.375rem] text-[#e8c9a0] leading-[1.6] mb-8 mt-6">
                        "Finally, a portal that acts like a smart associate. It parsed our traction data and immediately flagged us to the right micro-VCs."
                    </p>
                    <div>
                        <span className="block text-[0.875rem] text-white font-medium">Vikram Singh</span>
                        <span className="block text-[0.75rem] text-[#9b918a] mb-4">CEO, FinBridge</span>
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                            <span className="text-[0.75rem] text-[#9b918a]">Matched with:</span>
                            <Icon icon="solar:routing-linear" className="text-[#d4a574]" />
                            <span className="text-[0.75rem] text-white">Alpha Seed Fund</span>
                        </div>
                    </div>
                    <div className="mt-4"><span className="px-2 py-1 bg-[#7a9b76]/20 text-[#7a9b76] rounded text-[0.6875rem] border border-[#7a9b76]/30">FinTech &middot; Angel</span></div>
                </div>

            </div>
        </section>
    );
};
