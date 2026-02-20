import { Icon } from '@iconify/react';
// --- Startup Snapshot ---
export function StartupSnapshot() {
    return (
        <div className="lg:col-span-4 bg-[#f7f4f0] rounded-2xl p-6 shadow-soft stagger-1 flex flex-col justify-between border border-[#fffbf8]">
            <div>
                <h1 className="font-display italic text-[#3e3530] text-4xl tracking-tight mb-3">AgriNova</h1>
                <div className="flex gap-2 mb-6">
                    <span className="bg-[#e8e3dc] text-[#6b615b] px-3 py-1 rounded-full text-xs font-medium">Agritech</span>
                    <span className="bg-[#e8e3dc] text-[#6b615b] px-3 py-1 rounded-full text-xs font-medium">Precision Farming</span>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Stage</p>
                        <p className="font-semibold text-[#3e3530]">Series A</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Location</p>
                        <p className="font-semibold text-[#3e3530]">Pune, Maharashtra</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Model</p>
                        <p className="font-semibold text-[#3e3530]">B2B SaaS</p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Ask</p>
                        <p className="font-semibold text-[#3e3530]">₹2Cr – ₹5Cr</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-[#e8e3dc] pt-5 mt-6 flex flex-wrap gap-2">
                <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2.5 py-1 rounded-full text-[0.65rem] uppercase tracking-wider font-semibold">DPIIT Recognized</span>
                <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2.5 py-1 rounded-full text-[0.65rem] uppercase tracking-wider font-semibold">Women-led</span>
                <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2.5 py-1 rounded-full text-[0.65rem] uppercase tracking-wider font-semibold">Climate Impact</span>
            </div>
        </div>
    );
}

// --- Match Summary Widget ---
export function MatchSummary() {
    return (
        <div className="lg:col-span-3 bg-[#f7f4f0] rounded-2xl p-6 shadow-soft stagger-2 flex flex-col border border-[#fffbf8]">
            <h2 className="text-xs uppercase tracking-widest text-[#9b918a] font-semibold mb-2">Investor Matches</h2>
            <div className="flex items-start mb-6 relative">
                <span className="font-display text-6xl text-[#d4a574] leading-none tracking-tight">47</span>
                <span className="bg-[#d4a574] rounded-full w-2.5 h-2.5 animate-pulse-scale ml-2 mt-2"></span>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                    <span className="text-base">🔥</span>
                    <span className="text-xs text-[#6b615b]">Top Match:</span>
                    <span className="font-semibold text-[#7a9b76] text-base">86%</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-base">📈</span>
                    <span className="text-xs text-[#6b615b]">Avg Match:</span>
                    <span className="font-semibold text-[#d4a574] text-base">71%</span>
                </div>
            </div>

            <div className="mt-auto w-full flex h-2 rounded-full overflow-hidden bg-[#e8e3dc]">
                <div className="bg-[#7a9b76] w-[20%]"></div>
                <div className="bg-[#d4a574] w-[45%]"></div>
                <div className="bg-[#c77567] w-[15%]"></div>
            </div>
            <div className="flex justify-between mt-2 text-[0.65rem] text-[#9b918a]">
                <span>High (&gt;80%)</span>
                <span>Med</span>
                <span>Low</span>
            </div>
        </div>
    );
}

// --- Readiness Score Card ---
export function ReadinessScore() {
    return (
        <div className="lg:col-span-3 bg-[#f7f4f0] rounded-2xl p-6 shadow-soft stagger-3 flex flex-col items-center relative overflow-hidden border border-[#fffbf8]">
            <div className="relative w-[120px] h-[120px] mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-[#e8e3dc]" strokeWidth="2.5"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-[#d4a574] animate-ring-100" strokeWidth="2.5" strokeLinecap="round"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <span className="font-display text-4xl tracking-tight text-[#3e3530] leading-none">78</span>
                    <span className="text-[0.65rem] text-[#9b918a]">/100</span>
                </div>
            </div>

            <span className="bg-[#e8c9a0] text-[#b8865a] font-display italic px-4 py-1 rounded-full text-sm mb-6">Gold</span>

            <div className="w-full mt-auto">
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-[#6b615b]">Profile Completion</span>
                    <span className="font-semibold text-[#3e3530]">85%</span>
                </div>
                <div className="w-full bg-[#e8e3dc] h-1.5 rounded-full mb-3">
                    <div className="bg-[#d4a574] h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="text-right">
                    <a href="#" className="text-[#d4a574] text-xs font-semibold hover:text-[#b8865a] transition-colors inline-flex items-center gap-1">
                        Improve score <Icon icon="solar:arrow-right-linear" />
                    </a>
                </div>
            </div>
        </div>
    );
}

// --- Benchmark Banner ---
export function BenchmarkBanner() {
    return (
        <section className="stagger-4 w-full bg-[#e8e3dc]/60 rounded-xl p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-l-4 border-[#d4a574]">
            <div className="flex items-center gap-3">
                <span className="text-xl">📊</span>
                <p className="text-[#3e3530]">You rank in the <strong className="font-semibold text-[#d4a574]">top 28%</strong> of Agritech startups on platform by traction score.</p>
            </div>
            <a href="#" className="text-[#d4a574] text-sm font-semibold hover:text-[#b8865a] whitespace-nowrap inline-flex items-center gap-1 transition-colors">
                See full ranking <Icon icon="solar:arrow-right-linear" />
            </a>
        </section>
    );
}

// --- Recommended Investors ---
interface Investor {
    id: string;
    name: string;
    type: string; // 'Angel', 'VC', 'Impact Fund'
    matchScore: number;
    initials: string;
    description?: string;
    sectors: string[];
    details?: any;
}

export function RecommendedInvestors({ matches, onOpenPanel }: { matches: any[], onOpenPanel: (investor: any) => void }) {
    // If no matches provided, fallback to hardcoded list from index1.html for exact replication
    const defaultInvestors: Investor[] = [
        { id: '1', name: 'Priya Mehta', type: 'Angel', matchScore: 86, initials: 'PM', sectors: ['Agritech', 'ClimaTech'] },
        { id: '2', name: 'Arjun Capital', type: 'VC', matchScore: 81, initials: 'AC', sectors: ['AgriTech', 'Rural Tech'] },
        { id: '3', name: 'GreenPath Fund', type: 'Impact Fund', matchScore: 79, initials: 'GP', sectors: ['CleanTech', 'Agri'] },
        { id: '4', name: 'Ravi Ventures', type: 'Angel', matchScore: 74, initials: 'RV', sectors: ['B2B SaaS', 'DeepTech'] },
        { id: '5', name: 'Bharat Growth', type: 'VC', matchScore: 68, initials: 'BG', sectors: ['Agritech', 'D2C'] },
        { id: '6', name: 'SeedBridge', type: 'Angel', matchScore: 61, initials: 'SB', sectors: ['Early Stage', 'Impact'] }
    ];

    const displayInvestors = matches && matches.length > 0 ? matches.map(m => ({
        id: m.id,
        name: m.name,
        type: m.firmName ? 'VC' : 'Angel', // Simple heuristic
        matchScore: m.matchScore,
        initials: m.name.substring(0, 2).toUpperCase(),
        sectors: m.preferredSectors || ['Tech'],
    })) : defaultInvestors;

    return (
        <section className="stagger-5 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="font-display text-2xl tracking-tight text-[#3e3530]">Recommended Investors</h2>
                <div className="flex flex-wrap gap-2">
                    <button className="bg-[#d4a574] text-[#fffbf8] px-4 py-1.5 rounded-full text-xs font-medium transition-colors">All</button>
                    <button className="border border-[#e8e3dc] text-[#6b615b] bg-transparent hover:bg-[#f7f4f0] px-4 py-1.5 rounded-full text-xs font-medium transition-colors">Angel</button>
                    <button className="border border-[#e8e3dc] text-[#6b615b] bg-transparent hover:bg-[#f7f4f0] px-4 py-1.5 rounded-full text-xs font-medium transition-colors">VC</button>
                    <button className="border border-[#e8e3dc] text-[#6b615b] bg-transparent hover:bg-[#f7f4f0] px-4 py-1.5 rounded-full text-xs font-medium transition-colors">Impact Fund</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayInvestors.map(investor => (
                    <div key={investor.id} className="bg-[#fffbf8] border border-[#e8e3dc] rounded-2xl p-5 shadow-card hover:shadow-card-hover group relative transition-all duration-300 hover:border-[#d4a574]/50 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#7a9b76]/20 text-[#7a9b76] flex items-center justify-center font-display font-semibold text-lg">{investor.initials}</div>
                                <div>
                                    <h3 className="font-semibold text-[#3e3530] text-base leading-tight">{investor.name}</h3>
                                    <span className="bg-[#e8e3dc] text-[#6b615b] px-2 py-0.5 rounded text-[0.65rem] uppercase tracking-wide mt-1 inline-block">{investor.type}</span>
                                </div>
                            </div>
                            <span
                                className={`font-display text-3xl tracking-tight leading-none ${investor.matchScore >= 80 ? 'text-[#7a9b76]' : investor.matchScore >= 60 ? 'text-[#d4a574]' : 'text-[#c77567]'}`}
                            >
                                {investor.matchScore}%
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {investor.sectors.slice(0, 2).map((s: string, i: number) => (
                                <span key={i} className="bg-[#f7f4f0] text-[#6b615b] border border-[#e8e3dc] px-2.5 py-1 rounded-full text-xs">{s}</span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mb-6 px-1">
                            <FactorIcon icon="solar:leaf-linear" color="#7a9b76" />
                            <FactorIcon icon="solar:chart-square-linear" color="#7a9b76" />
                            <FactorIcon icon="solar:wallet-money-linear" color={investor.matchScore > 80 ? '#7a9b76' : '#d4a574'} />
                            <FactorIcon icon="solar:map-point-linear" color="#7a9b76" />
                            <FactorIcon icon="solar:heart-angle-linear" color="#7a9b76" />
                        </div>

                        <div className="mt-auto flex items-center gap-2 pt-2">
                            <button
                                onClick={() => onOpenPanel({ name: investor.name, type: investor.type, score: investor.matchScore })}
                                className="flex-1 border border-[#d4a574] text-[#d4a574] hover:bg-[#d4a574]/5 py-2 rounded-lg text-xs font-semibold transition-colors"
                            >
                                View Details
                            </button>
                            <button className="flex-1 bg-[#d4a574] text-[#fffbf8] hover:bg-[#b8865a] py-2 rounded-lg text-xs font-semibold transition-colors">Connect</button>
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-[#9b918a] hover:bg-[#f7f4f0] border border-transparent hover:border-[#e8e3dc] transition-all">
                                <Icon icon="solar:bookmark-linear" className="text-lg" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FactorIcon({ icon, color }: { icon: string, color: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
            <Icon icon={icon} className="text-[#9b918a] text-lg" />
        </div>
    );
}


// --- Improve Match Score ---
export function ImproveMatchScore() {
    return (
        <section className="stagger-5 mt-2">
            <details className="bg-[#fffbf8] border border-[#e8e3dc] rounded-2xl shadow-soft group/acc overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#f7f4f0]/50 transition-colors list-none">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">✨</span>
                        <h3 className="font-display text-lg tracking-tight text-[#3e3530]">Improve Your Match Score</h3>
                    </div>
                    <Icon icon="solar:alt-arrow-down-linear" className="text-[#d4a574] text-xl chevron-toggle transition-transform group-open/acc:rotate-180" />
                </summary>
                <div className="px-5 pb-6 border-t border-[#e8e3dc] pt-4">
                    <div className="flex flex-col gap-4 mb-6">
                        <ScoreAction label="Add revenue band to profile" points="+8 pts" />
                        <ScoreAction label="Upload pitch deck" points="+12 pts" />
                        <ScoreAction label="Specify equity % offered" points="+5 pts" />
                        <ScoreAction label="Add state-level expansion plan" points="+6 pts" />
                    </div>
                    <button className="border border-[#d4a574] text-[#d4a574] hover:bg-[#d4a574]/5 px-5 py-2 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2">
                        Complete Profile <Icon icon="solar:arrow-right-linear" />
                    </button>
                </div>
            </details>
        </section>
    );
}

function ScoreAction({ label, points }: { label: string, points: string }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a574]"></span>
                <span className="text-[#6b615b]">{label}</span>
            </div>
            <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2.5 py-1 rounded-full text-xs font-semibold">{points}</span>
        </div>
    );
}

// --- Traction and Impact ---
export function TractionSnapshot() {
    return (
        <section className="stagger-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#f7f4f0] rounded-2xl p-6 shadow-soft border border-[#fffbf8] flex flex-col">
                <h3 className="text-xs uppercase tracking-widest text-[#9b918a] font-semibold mb-5">Traction</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-auto">
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Revenue</p>
                        <p className="font-semibold text-[#3e3530] text-base">₹40L–₹80L <span className="text-xs font-normal text-[#6b615b]">ARR</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Growth</p>
                        <p className="font-semibold text-[#7a9b76] text-base">+34% <span className="text-xs font-normal text-[#6b615b]">QoQ</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Users</p>
                        <p className="font-semibold text-[#3e3530] text-base">1,200+ <span className="text-xs font-normal text-[#6b615b]">Farmers</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-[#9b918a] mb-1">Milestone</p>
                        <p className="font-semibold text-[#3e3530] text-sm leading-tight">First govt. contract signed</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#f7f4f0] rounded-2xl p-6 shadow-soft border border-[#fffbf8]">
                <h3 className="text-xs uppercase tracking-widest text-[#9b918a] font-semibold mb-5">Impact Tags</h3>
                <div className="flex flex-wrap gap-2.5">
                    <ImpactTag icon="🌿" label="Climate Impact" color="text-[#7a9b76]" bg="bg-[#7a9b76]/10" />
                    <ImpactTag icon="🌾" label="Agritech Mission" color="text-[#d4a574]" bg="bg-[#d4a574]/10" />
                    <ImpactTag icon="👩" label="Women-led" color="text-[#b8865a]" bg="bg-[#e8c9a0]/20" />
                    <ImpactTag icon="🏘️" label="Tier-2/3 Focus" color="text-[#6b615b]" bg="bg-[#e8e3dc]" />
                    <span className="inline-flex items-center gap-1.5 border border-[#3e3530]/20 text-[#3e3530] px-3 py-1.5 rounded-full text-xs font-medium"><span className="text-sm">🏛️</span> DPIIT Recognized</span>
                    <ImpactTag icon="💧" label="Water Conservation" color="text-[#7a9b76]" bg="bg-[#7a9b76]/10" />
                </div>
            </div>
        </section>
    );
}

function ImpactTag({ icon, label, color, bg }: { icon: string, label: string, color: string, bg: string }) {
    return (
        <span className={`inline-flex items-center gap-1.5 ${bg} ${color} px-3 py-1.5 rounded-full text-xs font-medium`}>
            <span className="text-sm">{icon}</span> {label}
        </span>
    );
}

// --- Activity and Messages ---
export function ActivityMessages() {
    return (
        <section className="stagger-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#f7f4f0] rounded-2xl p-6 shadow-soft border border-[#fffbf8]">
                <div className="grid grid-cols-2 gap-6 h-full content-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1"><Icon icon="solar:eye-linear" className="text-[#d4a574] text-lg" /><span className="text-xs text-[#9b918a]">Profile Views</span></div>
                        <span className="font-display text-3xl text-[#3e3530]">143</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1"><Icon icon="solar:star-linear" className="text-[#e8c9a0] text-lg" /><span className="text-xs text-[#9b918a]">Saved</span></div>
                        <span className="font-display text-3xl text-[#3e3530]">12</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1"><Icon icon="solar:inbox-in-linear" className="text-[#7a9b76] text-lg" /><span className="text-xs text-[#9b918a]">Requests</span></div>
                        <span className="font-display text-3xl text-[#3e3530]">8</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1"><span className="text-xs text-[#9b918a]">Status</span></div>
                        <div className="flex gap-3 items-baseline mt-1">
                            <span className="text-sm font-semibold text-[#7a9b76]"><span className="text-xs">✅</span> 5</span>
                            <span className="text-sm font-semibold text-[#c77567]"><span className="text-xs">❌</span> 3</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#f7f4f0] rounded-2xl p-6 shadow-soft border border-[#fffbf8] flex flex-col">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-display text-lg tracking-tight text-[#3e3530] flex items-center gap-2">Messages <span className="bg-[#d4a574] text-white w-5 h-5 rounded-full text-[0.65rem] flex items-center justify-center font-body">3</span></h3>
                </div>

                <div className="flex flex-col gap-4">
                    <MessageRow name="Sanjay Kapoor" time="10:42 AM" text="Let's connect regarding the recent traction update..." bg="bg-[#d4a574]/20" color="text-[#d4a574]" initials="SK" active={true} />
                    <MessageRow name="GreenPath Fund" time="Yesterday" text="We are reviewing the ESG deck you shared." bg="bg-[#7a9b76]/20" color="text-[#7a9b76]" initials="GP" active={false} />
                    <MessageRow name="Anjali L." time="Mon" text="Thanks for the quick response on the cap table." bg="bg-[#3e3530]/10" color="text-[#3e3530]" initials="AL" active={false} />
                </div>

                <a href="#" className="mt-4 text-xs text-[#d4a574] font-semibold inline-flex items-center gap-1 hover:text-[#b8865a] transition-colors">View All Messages <Icon icon="solar:arrow-right-linear" /></a>
            </div>
        </section>
    );
}

function MessageRow({ name, time, text, bg, color, initials, active }: { name: string, time: string, text: string, bg: string, color: string, initials: string, active: boolean }) {
    return (
        <div className={`flex gap-3 px-3 cursor-pointer group hover:bg-[#e8e3dc]/30 -mx-3 p-2 rounded-xl transition-colors ${active ? 'bg-[#e8e3dc]/50' : ''}`}>
            <div className={`w-10 h-10 rounded-full ${bg} ${color} flex-shrink-0 flex items-center justify-center font-display font-semibold`}>{initials}</div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={`truncate text-sm ${active ? 'font-semibold text-[#3e3530]' : 'text-[#3e3530]'}`}>{name}</h4>
                    <span className="text-[0.65rem] text-[#9b918a] flex-shrink-0">{time}</span>
                </div>
                <p className={`text-xs truncate ${active ? 'text-[#6b615b]' : 'text-[#9b918a]'}`}>{text}</p>
            </div>
        </div>
    );
}
