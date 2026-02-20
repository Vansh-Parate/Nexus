
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center px-6 lg:px-[5rem] py-[7.5rem] overflow-hidden">
            <div className="absolute inset-0 map-bg z-0"></div>
            <div className="absolute inset-0 gradient-mesh z-0"></div>

            <div className="relative z-10 w-full max-w-[80rem] mx-auto grid lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">

                {/* Left Copy */}
                <div className="flex flex-col items-start pr-0 lg:pr-8">
                    <div className="stagger-1 flex items-center gap-2 bg-[#f7f4f0] border border-[#e8e3dc] rounded-full px-3 py-1.5 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7a9b76] animate-pulse-dot"></div>
                        <span className="text-[0.625rem] font-medium tracking-[0.15em] uppercase text-[#6b615b]">Startup India Initiative &middot; Powered by AI</span>
                    </div>

                    <h1 className="stagger-2 font-display font-semibold text-[clamp(2.5rem,7vw,7.5rem)] leading-[1.05] tracking-tighter text-[#3e3530] mb-6">
                        Where Great<br />Startups Find<br />Their <span className="text-[#d4a574] italic pr-4">Match.</span>
                    </h1>

                    <p className="stagger-3 text-[1.125rem] lg:text-[1.25rem] font-light text-[#6b615b] leading-[1.7] max-w-xl mb-10">
                        India's first intelligent matchmaking engine connecting early-stage startups with aligned investors — scored, ranked, and ready to discover.
                    </p>

                    <div className="stagger-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
                        <Link to="/register?role=startup" className="px-8 py-4 rounded-full bg-[#d4a574] text-white font-medium hover:bg-[#b8865a] transition-colors flex items-center justify-center gap-2">
                            Create Startup Profile <Icon icon="solar:arrow-right-linear" strokeWidth="1.5" className="text-[1.25rem]" />
                        </Link>
                        <Link to="/register?role=investor" className="px-8 py-4 rounded-full border-[1.5px] border-[#d4a574] text-[#d4a574] font-medium hover:bg-[#f7f4f0] transition-colors flex items-center justify-center gap-2">
                            I'm an Investor <Icon icon="solar:user-rounded-linear" strokeWidth="1.5" className="text-[1.25rem]" />
                        </Link>
                    </div>

                    <div className="stagger-5 flex items-center gap-4 border-t border-[#e8e3dc] pt-6 w-full max-w-md">
                        <span className="text-[0.8125rem] text-[#9b918a]">Trusted by</span>
                        <div className="flex gap-4 opacity-50 grayscale">
                            <Icon icon="solar:shield-check-linear" className="text-[1.5rem]" />
                            <Icon icon="solar:buildings-linear" className="text-[1.5rem]" />
                            <Icon icon="solar:global-linear" className="text-[1.5rem]" />
                        </div>
                    </div>
                </div>

                {/* Right Visual (Match Orbit) */}
                <div className="stagger-5 relative w-full aspect-square max-w-[36rem] mx-auto lg:mx-0 mt-12 lg:mt-0">
                    <div className="orbit-system">

                        {/* Center Core */}
                        <div className="absolute inset-0 m-auto w-[16rem] h-[16rem] rounded-full flex items-center justify-center z-20 glass-card">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 300 300">
                                <circle cx="150" cy="150" r="140" fill="none" stroke="var(--surface-dark)" strokeWidth="4"></circle>
                                <circle cx="150" cy="150" r="140" fill="none" stroke="var(--primary-gold)" strokeWidth="4" strokeLinecap="round" strokeDasharray="0 1000" className="animate-ring"></circle>
                            </svg>
                            <div className="text-center flex flex-col items-center">
                                <span className="text-[0.625rem] font-medium uppercase tracking-[0.15em] text-[#9b918a] mb-1">Alignment Score</span>
                                <span className="font-display font-semibold text-[4.5rem] leading-none text-[#3e3530] tracking-tighter">94<span className="text-[2rem] text-[#d4a574]">%</span></span>
                            </div>
                        </div>

                        {/* Orbit 1 (Inner) */}
                        <div className="orbit-track w-[24rem] h-[24rem]" style={{ animationDuration: '24s' }}>
                            <div className="orbit-card-wrapper" style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}>
                                <div className="orbit-card glass-card px-4 py-3 rounded-lg flex items-center gap-3 border-l-4 border-l-[#d4a574]" style={{ animationDuration: '24s' }}>
                                    <div className="w-8 h-8 rounded-full bg-[#f7f4f0] flex items-center justify-center text-[#d4a574]">
                                        <Icon icon="solar:chart-square-linear" />
                                    </div>
                                    <div>
                                        <p className="text-[0.75rem] font-medium text-[#3e3530]">FinTech &middot; Seed Stage</p>
                                        <p className="text-[0.6875rem] text-[#6b615b]">₹50L ask</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orbit 2 (Outer) — cards spaced 180° apart to prevent overlap */}
                        <div className="orbit-track w-[32rem] h-[32rem]" style={{ animationDuration: '36s', animationDirection: 'reverse' }}>
                            <div className="orbit-card-wrapper" style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}>
                                <div className="orbit-card glass-card px-4 py-3 rounded-lg flex items-center gap-3 border-l-4 border-l-[#7a9b76]" style={{ animationDuration: '36s', animationDirection: 'reverse' }}>
                                    <div className="w-8 h-8 rounded-full bg-[#f7f4f0] flex items-center justify-center text-[#7a9b76]">
                                        <Icon icon="solar:wallet-money-linear" />
                                    </div>
                                    <div>
                                        <p className="text-[0.75rem] font-medium text-[#3e3530]">Angel Investor</p>
                                        <p className="text-[0.6875rem] text-[#6b615b]">₹2Cr ticket</p>
                                    </div>
                                </div>
                            </div>

                            <div className="orbit-card-wrapper" style={{ transform: 'translate(-50%, -50%) rotate(180deg)' }}>
                                <div className="orbit-card glass-card px-4 py-3 rounded-lg flex items-center gap-3 border-l-4 border-l-[#d89b6a]" style={{ animationDuration: '36s', animationDirection: 'reverse' }}>
                                    <div className="w-8 h-8 rounded-full bg-[#f7f4f0] flex items-center justify-center text-[#d89b6a]">
                                        <Icon icon="solar:heart-pulse-linear" />
                                    </div>
                                    <div>
                                        <p className="text-[0.75rem] font-medium text-[#3e3530]">Healthcare AI &middot; Series A</p>
                                        <p className="text-[0.6875rem] text-[#6b615b]">Scaling phase</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
