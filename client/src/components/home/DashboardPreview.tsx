import { Icon } from '@iconify/react';

export const DashboardPreview = () => {
    return (
        <section className="bg-[#fffbf8] py-[6.25rem] px-6 lg:px-[5rem] flex flex-col items-center">
            <h2 className="font-display font-semibold text-[2.5rem] lg:text-[3rem] text-[#3e3530] mb-12 tracking-tight text-center">The discovery engine, live</h2>

            {/* Browser Mockup */}
            <div className="w-full max-w-[70rem] bg-white rounded-2xl border border-[#e8e3dc] shadow-[0_2rem_5rem_rgba(62,53,48,0.12)] overflow-hidden">
                {/* Browser Chrome */}
                <div className="bg-[#f7f4f0] border-b border-[#e8e3dc] px-4 py-3 flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#c77567]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#d89b6a]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#7a9b76]"></div>
                    </div>
                    <div className="flex-1 max-w-xl mx-auto bg-white border border-[#e8e3dc] rounded-md py-1 px-3 text-center text-[0.75rem] text-[#9b918a]">
                        <Icon icon="solar:lock-keyhole-linear" className="align-middle mr-1" /> vega.startupindia.gov.in
                    </div>
                </div>

                {/* UI Body */}
                <div className="flex h-[35rem]">
                    {/* Sidebar */}
                    <div className="hidden sm:flex w-[4.5rem] border-r border-[#e8e3dc] bg-[#fffbf8] flex-col items-center py-6 gap-8 text-[#9b918a]">
                        <Icon icon="solar:home-smile-linear" className="text-[1.5rem]" />
                        <Icon icon="solar:magnifer-linear" className="text-[1.5rem] text-[#d4a574]" />
                        <Icon icon="solar:folder-with-files-linear" className="text-[1.5rem]" />
                        <Icon icon="solar:letter-linear" className="text-[1.5rem]" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white p-6 lg:p-8 overflow-y-hidden relative">
                        <h4 className="font-display font-semibold text-[1.5rem] text-[#3e3530] mb-6">Your Top Matches</h4>

                        <div className="space-y-4">
                            {/* Match Item 1 */}
                            <div className="flex items-center justify-between p-4 border border-[#e8e3dc] rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#e8c9a0]/30 rounded-full flex items-center justify-center text-[#d4a574] font-display font-semibold">A</div>
                                    <div>
                                        <h5 className="text-[1rem] font-medium text-[#3e3530]">AgriTech Solutions</h5>
                                        <span className="text-[0.75rem] text-[#6b615b]">Agriculture &middot; Series A</span>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-end w-[12rem]">
                                    <span className="text-[0.75rem] font-medium text-[#7a9b76] mb-1">92% Match</span>
                                    <div className="w-full h-1.5 bg-[#f7f4f0] rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#d4a574] to-[#7a9b76] w-[92%]"></div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.8125rem] font-medium text-[#3e3530] hover:bg-[#f7f4f0]">Connect</button>
                            </div>

                            {/* Match Item 2 */}
                            <div className="flex items-center justify-between p-4 border border-[#e8e3dc] rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#7a9b76]/20 rounded-full flex items-center justify-center text-[#7a9b76] font-display font-semibold">H</div>
                                    <div>
                                        <h5 className="text-[1rem] font-medium text-[#3e3530]">HealthAI Diagnostics</h5>
                                        <span className="text-[0.75rem] text-[#6b615b]">Healthcare &middot; Seed</span>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-end w-[12rem]">
                                    <span className="text-[0.75rem] font-medium text-[#d4a574] mb-1">85% Match</span>
                                    <div className="w-full h-1.5 bg-[#f7f4f0] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#d4a574] w-[85%]"></div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.8125rem] font-medium text-[#3e3530] hover:bg-[#f7f4f0]">Connect</button>
                            </div>

                            {/* Match Item 3 */}
                            <div className="flex items-center justify-between p-4 border border-[#e8e3dc] rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#3e3530]/10 rounded-full flex items-center justify-center text-[#3e3530] font-display font-semibold">F</div>
                                    <div>
                                        <h5 className="text-[1rem] font-medium text-[#3e3530]">FinFlow Pay</h5>
                                        <span className="text-[0.75rem] text-[#6b615b]">FinTech &middot; Pre-Seed</span>
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-end w-[12rem]">
                                    <span className="text-[0.75rem] font-medium text-[#d89b6a] mb-1">78% Match</span>
                                    <div className="w-full h-1.5 bg-[#f7f4f0] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#d89b6a] w-[78%]"></div>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.8125rem] font-medium text-[#3e3530] hover:bg-[#f7f4f0]">Connect</button>
                            </div>
                        </div>

                        {/* Gradient fade at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-[6rem] bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    </div>

                    {/* Right Filter Panel */}
                    <div className="hidden lg:block w-[18rem] border-l border-[#e8e3dc] bg-[#f7f4f0]/50 p-6">
                        <span className="text-[0.75rem] font-medium uppercase tracking-wider text-[#9b918a] mb-4 block">Active Filters</span>

                        <div className="space-y-6">
                            <div>
                                <span className="text-[0.8125rem] text-[#3e3530] mb-2 block">Match Threshold</span>
                                <div className="w-full h-1 bg-[#e8e3dc] rounded-full relative">
                                    <div className="absolute left-0 top-0 h-full w-[70%] bg-[#d4a574] rounded-full"></div>
                                    <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#d4a574] rounded-full shadow"></div>
                                </div>
                                <div className="flex justify-between text-[0.6875rem] text-[#9b918a] mt-1"><span>0%</span><span>&gt; 70%</span></div>
                            </div>

                            <div>
                                <span className="text-[0.8125rem] text-[#3e3530] mb-2 block">Sectors</span>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-white border border-[#d4a574] text-[#d4a574] rounded text-[0.6875rem]">Agriculture</span>
                                    <span className="px-2 py-1 bg-white border border-[#d4a574] text-[#d4a574] rounded text-[0.6875rem]">Healthcare</span>
                                    <span className="px-2 py-1 bg-white border border-[#e8e3dc] text-[#6b615b] rounded text-[0.6875rem]">FinTech</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Row */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#e8e3dc] shadow-sm">
                    <Icon icon="solar:chart-square-linear" className="text-[#d4a574]" />
                    <span className="text-[0.8125rem] font-medium text-[#3e3530]">Real-time scoring</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#e8e3dc] shadow-sm">
                    <Icon icon="solar:filters-linear" className="text-[#d4a574]" />
                    <span className="text-[0.8125rem] font-medium text-[#3e3530]">Smart filters</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-[#e8e3dc] shadow-sm">
                    <Icon icon="solar:bolt-linear" className="text-[#d4a574]" />
                    <span className="text-[0.8125rem] font-medium text-[#3e3530]">Instant connect</span>
                </div>
            </div>
        </section>
    );
};
