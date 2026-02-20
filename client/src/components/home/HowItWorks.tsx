import React from 'react';
import { Icon } from '@iconify/react';

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="bg-[#fffbf8] py-[7.5rem] px-6 lg:px-[5rem] scroll-mt-28">
            <div className="max-w-[80rem] mx-auto">
                <div className="text-center mb-16 lg:mb-24">
                    <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#9b918a] block mb-4">The Engine</span>
                    <h2 className="font-display font-semibold text-[2.5rem] lg:text-[3.5rem] text-[#3e3530] mb-4 tracking-tight">Three steps to your perfect match</h2>
                    <p className="text-[1.125rem] text-[#6b615b] max-w-2xl mx-auto">From profile to funded in a structured, AI-scored journey</p>
                </div>

                <div className="relative flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 lg:gap-4">

                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[12rem] left-0 w-full border-t-2 border-dashed border-[#e8e3dc] z-0">
                        <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-8 h-8 bg-[#fffbf8] flex items-center justify-center text-[#d4a574]">
                            <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" />
                        </div>
                        <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-8 h-8 bg-[#fffbf8] flex items-center justify-center text-[#d4a574]">
                            <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" />
                        </div>
                    </div>

                    {/* Step 1 */}
                    <div className="relative z-10 w-full max-w-[24rem] bg-[#f7f4f0] rounded-[1rem] p-8 lg:mt-0 shadow-sm border border-[#e8e3dc] hover:shadow-[0_1.25rem_3rem_rgba(62,53,48,0.12)] transition-shadow duration-300">
                        <div className="w-full h-[12rem] mb-8 bg-gradient-to-br from-[#e8c9a0]/30 to-transparent rounded-lg flex items-center justify-center relative overflow-hidden">
                            <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="text-[#d4a574] opacity-50">
                                <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.4,-2.4C98.1,13.2,93.4,29.1,84.1,42.5C74.8,55.9,60.9,66.8,46.1,75.4C31.3,84.1,15.6,90.5,-0.6,91.5C-16.8,92.4,-33.6,88,-48.5,79.5C-63.4,71,-76.4,58.4,-85.4,43.2C-94.4,28,-99.3,10.2,-97.7,-6.8C-96.1,-23.8,-88.1,-40,-76.3,-53.1C-64.5,-66.2,-48.9,-76.2,-33.5,-81.1C-18.1,-86,-2.4,-85.8,11.8,-81.3Z" transform="translate(100 100) scale(1.1)" />
                            </svg>
                            <Icon icon="solar:document-text-linear" className="absolute text-[3rem] text-[#d4a574]" />
                        </div>
                        <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#9b918a] mb-2 block">01 &middot; Startups & Investors</span>
                        <h3 className="font-display font-semibold text-[1.375rem] text-[#3e3530] mb-3">Structured profiles that speak data</h3>
                        <p className="text-[#6b615b] text-[0.9375rem] leading-[1.6] mb-6">Answer 12 targeted questions. Sector, stage, ticket size, geography, traction. Our engine reads every field.</p>
                        <span className="inline-block px-3 py-1 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.6875rem] font-medium text-[#6b615b]">Takes 8 minutes</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 w-full max-w-[24rem] bg-[#f7f4f0] rounded-[1rem] p-8 lg:mt-[6rem] shadow-sm border border-[#e8e3dc] hover:shadow-[0_1.25rem_3rem_rgba(62,53,48,0.12)] transition-shadow duration-300">
                        <div className="w-full h-[12rem] mb-8 bg-gradient-to-bl from-[#7a9b76]/20 to-transparent rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center opacity-60">
                                <svg width="140" height="140" viewBox="0 0 100 100">
                                    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#7a9b76" strokeWidth="1" className="animate-[pulse_3s_infinite]" />
                                    <polygon points="50,25 75,40 75,60 50,75 25,60 25,40" fill="none" stroke="#d4a574" strokeWidth="1" />
                                    <line x1="50" y1="50" x2="50" y2="10" stroke="#9b918a" strokeWidth="0.5" strokeDasharray="2 2" />
                                    <line x1="50" y1="50" x2="90" y2="30" stroke="#9b918a" strokeWidth="0.5" strokeDasharray="2 2" />
                                    <line x1="50" y1="50" x2="10" y2="30" stroke="#9b918a" strokeWidth="0.5" strokeDasharray="2 2" />
                                </svg>
                            </div>
                            <Icon icon="solar:cpu-linear" className="absolute text-[3rem] text-[#3e3530]" />
                        </div>
                        <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#9b918a] mb-2 block">02 &middot; AI Matching</span>
                        <h3 className="font-display font-semibold text-[1.375rem] text-[#3e3530] mb-3">Proprietary scoring across 14 dimensions</h3>
                        <p className="text-[#6b615b] text-[0.9375rem] leading-[1.6] mb-6">Sector overlap, stage compatibility, geographic focus, ESG alignment, team experience — all weighted and computed.</p>
                        <div className="flex gap-2">
                            <span className="inline-block px-3 py-1 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.6875rem] font-medium text-[#6b615b]">14 Parameters</span>
                            <span className="inline-block px-3 py-1 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.6875rem] font-medium text-[#6b615b]">Real-time</span>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 w-full max-w-[24rem] bg-[#f7f4f0] rounded-[1rem] p-8 lg:mt-0 shadow-sm border border-[#e8e3dc] hover:shadow-[0_1.25rem_3rem_rgba(62,53,48,0.12)] transition-shadow duration-300">
                        <div className="w-full h-[12rem] mb-8 bg-gradient-to-t from-[#e8e3dc]/50 to-transparent rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="w-[80%] h-[70%] bg-white rounded shadow-sm border border-[#e8e3dc] p-3 flex flex-col gap-2 relative top-4">
                                <div className="w-full h-2 bg-[#f7f4f0] rounded"></div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#d4a574]/20"></div>
                                    <div className="w-full h-2 bg-[#f7f4f0] rounded"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#7a9b76]/20"></div>
                                    <div className="w-full h-2 bg-[#f7f4f0] rounded"></div>
                                </div>
                            </div>
                            <Icon icon="solar:minimize-square-linear" className="absolute text-[3rem] text-[#d4a574]" />
                        </div>
                        <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#9b918a] mb-2 block">03 &middot; Discovery</span>
                        <h3 className="font-display font-semibold text-[1.375rem] text-[#3e3530] mb-3">Ranked matches, ready to act</h3>
                        <p className="text-[#6b615b] text-[0.9375rem] leading-[1.6] mb-6">Browse your top matches sorted by alignment score. Send connection requests, exchange decks, schedule calls.</p>
                        <span className="inline-block px-3 py-1 bg-[#fffbf8] border border-[#e8e3dc] rounded-full text-[0.6875rem] font-medium text-[#6b615b]">1-click outreach</span>
                    </div>

                </div>
            </div>
        </section>
    );
};
