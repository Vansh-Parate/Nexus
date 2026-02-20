import { Icon } from '@iconify/react';
import { requestsApi, savedApi } from '../../../api/endpoints';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
export interface DashboardData {
    startup: {
        id: string;
        startupName: string;
        founderName: string;
        sector: string;
        stage: string;
        location: string;
        description?: string;
        pitch?: string;
        fundingSought: number;
        fundingAsk: string;
        traction: Record<string, any>;
        useOfFunds?: string;
        foundedAt?: string;
        avatar?: string;
        userName?: string;
    };
    matchSummary: {
        totalMatches: number;
        topMatchScore: number;
        avgMatchScore: number;
        distribution: { highPct: number; medPct: number; lowPct: number };
    };
    readiness: {
        score: number;
        tier: string;
        profileCompletion: number;
    };
    benchmark: {
        topPercentile: number;
        sector: string;
        totalInSector: number;
    };
    matches: MatchInvestor[];
    missingActions: { label: string; points: string; pointsValue: number }[];
    activity: {
        totalSent: number;
        totalReceived: number;
        accepted: number;
        declined: number;
        pending: number;
    };
}

export interface MatchInvestor {
    id: string;
    userId?: string;
    name: string;
    firmName?: string;
    investorType: string;
    preferredSectors: string[];
    preferredStages?: string[];
    ticketMin?: number;
    ticketMax?: number;
    thesis?: string;
    matchScore: number;
}

/* ───────── Shared sub-label style ───────── */
const LABEL_CLS = 'text-[0.65rem] uppercase tracking-[0.08em] text-[#9b918a] font-semibold';

/* ═══════════════════════════════════════════
   STARTUP SNAPSHOT
   ═══════════════════════════════════════════ */
export function StartupSnapshot({ data }: { data: DashboardData | null }) {
    const s = data?.startup;

    return (
        <div className="lg:col-span-4 bg-[#f7f4f0] rounded-2xl p-5 md:p-6 shadow-soft stagger-1 flex flex-col justify-between border border-[#fffbf8]">
            <div>
                <h2 className="font-display italic text-[#3e3530] text-[1.65rem] md:text-[2rem] tracking-tight leading-[1.15] mb-2.5">
                    {s?.startupName || '—'}
                </h2>
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {s?.sector && (
                        <span className="bg-[#e8e3dc] text-[#6b615b] px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium tracking-wide">{s.sector}</span>
                    )}
                    {s?.stage && (
                        <span className="bg-[#e8e3dc] text-[#6b615b] px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium tracking-wide">{s.stage}</span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-3">
                    <InfoField label="Stage" value={s?.stage || '—'} />
                    <InfoField label="Location" value={s?.location || '—'} />
                    <InfoField label="Founder" value={s?.founderName || '—'} />
                    <InfoField label="Ask" value={s?.fundingAsk || '—'} />
                </div>
            </div>

            {/* Bottom tags */}
            <div className="border-t border-[#e8e3dc]/60 pt-4 mt-5 flex flex-wrap gap-1.5">
                {s?.pitch && (
                    <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2 py-0.5 rounded-full text-[0.6rem] uppercase tracking-wider font-semibold">
                        Pitch Deck ✓
                    </span>
                )}
                {s?.foundedAt && (
                    <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2 py-0.5 rounded-full text-[0.6rem] uppercase tracking-wider font-semibold">
                        Est. {new Date(s.foundedAt).getFullYear()}
                    </span>
                )}
                {s?.useOfFunds && (
                    <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2 py-0.5 rounded-full text-[0.6rem] uppercase tracking-wider font-semibold">
                        Use of Funds ✓
                    </span>
                )}
            </div>
        </div>
    );
}

function InfoField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className={LABEL_CLS}>{label}</p>
            <p className="font-semibold text-[#3e3530] text-[0.8rem] leading-snug mt-0.5">{value}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════
   MATCH SUMMARY
   ═══════════════════════════════════════════ */
export function MatchSummary({ data }: { data: DashboardData | null }) {
    const ms = data?.matchSummary;
    return (
        <div className="lg:col-span-3 bg-[#f7f4f0] rounded-2xl p-5 md:p-6 shadow-soft stagger-2 flex flex-col border border-[#fffbf8]">
            <h3 className={`${LABEL_CLS} mb-2`}>Investor Matches</h3>

            <div className="flex items-start mb-5 relative">
                <span className="font-display text-[3.2rem] text-[#d4a574] leading-none tracking-tight">{ms?.totalMatches ?? 0}</span>
                <span className="bg-[#d4a574] rounded-full w-2 h-2 animate-pulse-scale ml-1.5 mt-2"></span>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1">
                    <span className="text-sm">🔥</span>
                    <span className="text-[0.65rem] text-[#6b615b]">Top:</span>
                    <span className="font-semibold text-[#7a9b76] text-sm">{ms?.topMatchScore ?? 0}%</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-sm">📈</span>
                    <span className="text-[0.65rem] text-[#6b615b]">Avg:</span>
                    <span className="font-semibold text-[#d4a574] text-sm">{ms?.avgMatchScore ?? 0}%</span>
                </div>
            </div>

            <div className="mt-auto w-full flex h-1.5 rounded-full overflow-hidden bg-[#e8e3dc]">
                <div className="bg-[#7a9b76]" style={{ width: `${ms?.distribution.highPct ?? 0}%` }}></div>
                <div className="bg-[#d4a574]" style={{ width: `${ms?.distribution.medPct ?? 0}%` }}></div>
                <div className="bg-[#c77567]" style={{ width: `${ms?.distribution.lowPct ?? 0}%` }}></div>
            </div>
            <div className="flex justify-between mt-1.5 text-[0.6rem] text-[#9b918a]">
                <span>High (&gt;80%)</span>
                <span>Med</span>
                <span>Low</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   READINESS SCORE
   ═══════════════════════════════════════════ */
export function ReadinessScore({ data }: { data: DashboardData | null }) {
    const r = data?.readiness;
    const score = r?.score ?? 0;
    const dashArray = `${(score / 100) * 100}, 100`;
    const tierColors: Record<string, string> = {
        Gold: 'bg-[#e8c9a0] text-[#b8865a]',
        Silver: 'bg-[#e8e3dc] text-[#6b615b]',
        Bronze: 'bg-[#c77567]/20 text-[#c77567]',
    };

    return (
        <div className="lg:col-span-3 bg-[#f7f4f0] rounded-2xl p-5 md:p-6 shadow-soft stagger-3 flex flex-col items-center relative overflow-hidden border border-[#fffbf8]">
            <div className="relative w-[100px] h-[100px] mb-3">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-[#e8e3dc]" strokeWidth="2.5"></circle>
                    <circle
                        cx="18" cy="18" r="15.915" fill="none"
                        className="stroke-[#d4a574]"
                        strokeWidth="2.5" strokeLinecap="round"
                        strokeDasharray={dashArray}
                        style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                    ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-[2rem] tracking-tight text-[#3e3530] leading-none">{score}</span>
                    <span className="text-[0.55rem] text-[#9b918a]">/100</span>
                </div>
            </div>

            <span className={`font-display italic px-3 py-0.5 rounded-full text-[0.75rem] mb-5 ${tierColors[r?.tier ?? 'Bronze'] ?? tierColors.Bronze}`}>
                {r?.tier ?? 'Bronze'}
            </span>

            <div className="w-full mt-auto">
                <div className="flex justify-between text-[0.65rem] mb-1.5">
                    <span className="text-[#6b615b]">Profile Completion</span>
                    <span className="font-semibold text-[#3e3530]">{r?.profileCompletion ?? 0}%</span>
                </div>
                <div className="w-full bg-[#e8e3dc] h-1 rounded-full mb-2">
                    <div
                        className="bg-[#d4a574] h-1 rounded-full transition-all duration-700"
                        style={{ width: `${r?.profileCompletion ?? 0}%` }}
                    ></div>
                </div>
                <div className="text-right">
                    <a href="#" className="text-[#d4a574] text-[0.65rem] font-semibold hover:text-[#b8865a] transition-colors inline-flex items-center gap-0.5">
                        Improve score <Icon icon="solar:arrow-right-linear" className="text-xs" />
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   BENCHMARK BANNER
   ═══════════════════════════════════════════ */
export function BenchmarkBanner({ data }: { data: DashboardData | null }) {
    const b = data?.benchmark;
    return (
        <section className="stagger-4 w-full bg-[#e8e3dc]/50 rounded-xl py-3.5 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-l-4 border-[#d4a574]">
            <div className="flex items-center gap-2.5">
                <span className="text-lg">📊</span>
                <p className="text-[#3e3530] text-[0.8rem] leading-snug">
                    You rank in the{' '}
                    <strong className="font-semibold text-[#d4a574]">top {b?.topPercentile ?? 50}%</strong> of{' '}
                    {b?.sector ?? 'your sector'} startups on platform by traction score.
                </p>
            </div>
            <a href="#" className="text-[#d4a574] text-[0.75rem] font-semibold hover:text-[#b8865a] whitespace-nowrap inline-flex items-center gap-1 transition-colors">
                See full ranking <Icon icon="solar:arrow-right-linear" className="text-xs" />
            </a>
        </section>
    );
}

/* ═══════════════════════════════════════════
   RECOMMENDED INVESTORS (HTML design)
   ═══════════════════════════════════════════ */
const PAGE_SIZE = 6;
const FACTOR_NAMES = ['Sector', 'Stage', 'Ticket', 'Geo', 'Impact'] as const;
const FACTOR_ICONS = ['🌾', '📈', '💰', '📍', '🌿'] as const;

function avatarVariant(score: number): 'sage' | 'amber' | 'clay' {
    if (score >= 80) return 'sage';
    if (score >= 60) return 'amber';
    return 'clay';
}

function factorPct(score: number, index: number): number {
    const offsets = [10, 0, -5, 5, 15];
    return Math.min(100, Math.max(0, score + (offsets[index] ?? 0)));
}

function factorStatus(pct: number): 'match' | 'partial' | 'miss' {
    if (pct >= 80) return 'match';
    if (pct >= 50) return 'partial';
    return 'miss';
}

export function RecommendedInvestors({
    matches,
    onOpenPanel,
}: {
    matches: MatchInvestor[];
    onOpenPanel: (investor: { name: string; type: string; score: number; id: string }) => void;
}) {
    const [filter, setFilter] = useState<string>('All');
    const [page, setPage] = useState(0);
    const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        savedApi.list().then((r) => {
            const ids = new Set((r.data.saved || []).map((s: { id: string }) => s.id));
            setSavedIds(ids);
        }).catch(() => {});
    }, []);
    const types = ['All', 'Angel', 'VC', 'Impact Fund'];

    const filtered = filter === 'All'
        ? matches
        : matches.filter((m) => m.investorType === filter);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safeP = Math.min(page, totalPages - 1);
    const pageItems = filtered.slice(safeP * PAGE_SIZE, safeP * PAGE_SIZE + PAGE_SIZE);

    const handleFilter = (t: string) => {
        setFilter(t);
        setPage(0);
    };

    return (
        <section className="flex flex-col gap-6 mb-14">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b918a] mb-1">AI-Powered Matching</div>
                    <h2 className="font-display text-[26px] font-semibold tracking-tight text-[#3e3530]">Recommended Investors</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => handleFilter(t)}
                            className={`px-[18px] py-[7px] rounded-full text-[13px] font-medium border transition-all duration-[0.18s] ${filter === t
                                    ? 'bg-[#d4a574] border-[#d4a574] text-white'
                                    : 'border-[#e8e3dc] text-[#6b615b] bg-transparent hover:border-[#d4a574] hover:text-[#d4a574]'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-[#9b918a]">
                    <Icon icon="solar:users-group-rounded-linear" className="text-4xl mb-3 mx-auto block opacity-50" />
                    <p className="text-sm">No {filter !== 'All' ? filter : ''} investors matched yet.</p>
                    <p className="text-xs mt-1">Complete your profile to improve matching.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {pageItems.map((investor, idx) => (
                    <div
                        key={investor.id}
                        className="group investor-card-new bg-white border-[1.5px] border-[#e8e3dc] rounded-2xl p-[22px] flex flex-col relative overflow-hidden cursor-pointer transition-all duration-[0.22s] hover:shadow-[0_8px_28px_rgba(62,53,48,0.12)] hover:border-[#e8c9a0] hover:-translate-y-0.5"
                        style={{ animationDelay: `${0.05 + idx * 0.07}s` }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#e8c9a0] to-[#d4a574] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold border-[1.5px] flex-shrink-0 ${
                                        avatarVariant(investor.matchScore) === 'sage'
                                            ? 'bg-[rgba(122,155,118,0.12)] text-[#7a9b76] border-[rgba(122,155,118,0.2)]'
                                            : avatarVariant(investor.matchScore) === 'amber'
                                                ? 'bg-[rgba(216,155,106,0.12)] text-[#d89b6a] border-[rgba(216,155,106,0.2)]'
                                                : 'bg-[rgba(199,117,103,0.1)] text-[#c77567] border-[rgba(199,117,103,0.2)]'
                                    }`}
                                >
                                    {investor.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-semibold text-[15px] text-[#3e3530] leading-tight mb-0.5">{investor.name}</div>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9b918a] bg-[#f7f4f0] px-2 py-0.5 rounded inline-block">
                                        {investor.investorType}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                                <span
                                    className={`font-display text-[28px] font-semibold leading-none ${
                                        investor.matchScore >= 80 ? 'text-[#7a9b76]' : investor.matchScore >= 60 ? 'text-[#d4a574]' : 'text-[#c77567]'
                                    }`}
                                >
                                    {investor.matchScore}%
                                </span>
                                <span className="text-[10px] font-medium text-[#9b918a] tracking-wide">match</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
                            {investor.preferredSectors.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f7f4f0] text-[#6b615b] border border-[#e8e3dc]">
                                    {s}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-0 bg-[#f7f4f0] rounded-[10px] py-3 px-2.5 justify-between mb-4">
                            {FACTOR_NAMES.map((name, i) => {
                                const pct = factorPct(investor.matchScore, i);
                                const status = factorStatus(pct);
                                return (
                                    <div key={name} className="flex flex-col items-center gap-1 flex-1">
                                        <div
                                            className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${
                                                status === 'match' ? 'bg-[#7a9b76]' : status === 'partial' ? 'bg-[#d4a574]' : 'bg-[#c77567]'
                                            }`}
                                        />
                                        <span className="text-[15px] opacity-70 leading-none">{FACTOR_ICONS[i]}</span>
                                        <div className="w-7 h-0.5 bg-[#e8e3dc] rounded overflow-hidden">
                                            <div
                                                className={`h-full rounded transition-[width] duration-500 ${
                                                    status === 'match' ? 'bg-[#7a9b76]' : status === 'partial' ? 'bg-[#d4a574]' : 'bg-[#c77567]'
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-[9px] font-medium text-[#9b918a] text-center tracking-wide">{name}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-auto flex gap-2 items-center">
                            <button
                                onClick={() => onOpenPanel({ name: investor.name, type: investor.investorType, score: investor.matchScore, id: investor.id })}
                                className="flex-1 py-2 border-[1.5px] border-[#d4a574] bg-transparent text-[#d4a574] rounded-lg text-[13px] font-medium transition-colors hover:bg-[rgba(212,165,116,0.08)] cursor-pointer"
                            >
                                View Details
                            </button>
                            <button
                                className="flex-[1.2] py-2 bg-[#d4a574] text-white rounded-lg text-[13px] font-semibold transition-colors hover:bg-[#b8865a] cursor-pointer"
                                onClick={async () => {
                                    try {
                                        await requestsApi.send(investor.id, 'investor');
                                        toast.success('Connection request sent!');
                                    } catch (err) {
                                        console.error('Failed to send connect request:', err);
                                        toast.error('Failed to send request. Try again.');
                                    }
                                }}
                            >
                                Connect
                            </button>
                            <button
                                className={`w-9 h-9 flex items-center justify-center rounded-lg border-[1.5px] flex-shrink-0 transition-colors cursor-pointer ${
                                    savedIds.has(investor.id)
                                        ? 'border-[#d4a574] text-[#d4a574] bg-[rgba(212,165,116,0.08)]'
                                        : 'border-[#e8e3dc] text-[#9b918a] hover:border-[#d4a574] hover:text-[#d4a574]'
                                }`}
                                disabled={savingIds[investor.id]}
                                title={savedIds.has(investor.id) ? 'Remove from saved' : 'Save investor'}
                                onClick={async () => {
                                    setSavingIds((prev) => ({ ...prev, [investor.id]: true }));
                                    try {
                                        if (savedIds.has(investor.id)) {
                                            await savedApi.remove(investor.id);
                                            setSavedIds((prev) => {
                                                const next = new Set(prev);
                                                next.delete(investor.id);
                                                return next;
                                            });
                                            toast.success('Removed from saved');
                                        } else {
                                            await savedApi.save(investor.id);
                                            setSavedIds((prev) => new Set(prev).add(investor.id));
                                            toast.success('Investor saved');
                                        }
                                    } catch (err) {
                                        console.error('Failed to toggle saved investor:', err);
                                        toast.error('Failed to save. Try again.');
                                    } finally {
                                        setSavingIds((prev) => ({ ...prev, [investor.id]: false }));
                                    }
                                }}
                            >
                                <Icon
                                    icon={savedIds.has(investor.id) ? 'solar:bookmark-bold' : 'solar:bookmark-linear'}
                                    className="text-lg"
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={safeP === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e3dc] text-[#9b918a] hover:bg-[#f7f4f0] hover:text-[#3e3530] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <Icon icon="solar:alt-arrow-left-linear" className="text-sm" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${safeP === i ? 'bg-[#d4a574] text-white' : 'border border-[#e8e3dc] text-[#6b615b] hover:bg-[#f7f4f0]'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={safeP === totalPages - 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e3dc] text-[#9b918a] hover:bg-[#f7f4f0] hover:text-[#3e3530] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <Icon icon="solar:alt-arrow-right-linear" className="text-sm" />
                    </button>
                    <span className="text-[11px] text-[#9b918a] ml-2">
                        {safeP * PAGE_SIZE + 1}–{Math.min((safeP + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
                    </span>
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════════
   IMPROVE MATCH SCORE
   ═══════════════════════════════════════════ */
export function ImproveMatchScore({ data }: { data: DashboardData | null }) {
    const actions = data?.missingActions ?? [];
    if (actions.length === 0) return null;

    return (
        <section className="stagger-5">
            <details className="bg-[#fffbf8] border border-[#e8e3dc] rounded-2xl shadow-soft group/acc overflow-hidden">
                <summary className="flex items-center justify-between p-4 md:p-5 cursor-pointer hover:bg-[#f7f4f0]/50 transition-colors list-none">
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg">✨</span>
                        <h3 className="font-display text-base tracking-tight text-[#3e3530]">Improve Your Match Score</h3>
                        <span className="bg-[#d4a574]/10 text-[#d4a574] px-2 py-px rounded-full text-[0.6rem] font-semibold">
                            {actions.length} action{actions.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <Icon icon="solar:alt-arrow-down-linear" className="text-[#d4a574] text-lg chevron-toggle transition-transform group-open/acc:rotate-180" />
                </summary>
                <div className="px-4 md:px-5 pb-5 border-t border-[#e8e3dc] pt-4">
                    <div className="flex flex-col gap-3 mb-5">
                        {actions.map((a, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4a574]"></span>
                                    <span className="text-[#6b615b] text-[0.8rem]">{a.label}</span>
                                </div>
                                <span className="bg-[#7a9b76]/10 text-[#7a9b76] px-2 py-0.5 rounded-full text-[0.6rem] font-semibold">{a.points}</span>
                            </div>
                        ))}
                    </div>
                    <button className="border border-[#d4a574] text-[#d4a574] hover:bg-[#d4a574]/5 px-4 py-1.5 rounded-lg text-[0.75rem] font-semibold transition-colors inline-flex items-center gap-1.5">
                        Complete Profile <Icon icon="solar:arrow-right-linear" className="text-xs" />
                    </button>
                </div>
            </details>
        </section>
    );
}

/* ═══════════════════════════════════════════
   FUNDRAISE FUNNEL (backend + mock fallback)
   ═══════════════════════════════════════════ */
const FUNNEL_BAR_COLORS = ['#e8c9a0', '#c9a882', '#d4a574', '#d89b6a', '#7a9b76'];

const MOCK_FUNNEL = {
    matched: 47,
    reached: 34,
    interested: 18,
    inTalks: 8,
    termSheet: 3,
    conversionPct: 6.4,
    avgDaysToTermSheet: '18d',
    committedEst: '₹3.2Cr',
};

export function FundraiseFunnel({ data }: { data: DashboardData | null }) {
    const totalMatches = data?.matchSummary?.totalMatches ?? 0;
    const sent = data?.activity?.totalSent ?? 0;
    const accepted = data?.activity?.accepted ?? 0;
    const pending = data?.activity?.pending ?? 0;

    const hasNoActivity = sent === 0 && accepted === 0 && pending === 0;
    const useMockDownstream = hasNoActivity;
    const matchedCount = totalMatches || MOCK_FUNNEL.matched;
    const scale = matchedCount > 0 && matchedCount !== MOCK_FUNNEL.matched ? matchedCount / MOCK_FUNNEL.matched : 1;
    const reachedCount = sent || (useMockDownstream ? Math.round(MOCK_FUNNEL.reached * scale) : 0);
    const interestedCount = accepted || (useMockDownstream ? Math.round(MOCK_FUNNEL.interested * scale) : 0);
    const inTalksCount = pending || (useMockDownstream ? Math.round(MOCK_FUNNEL.inTalks * scale) : 0);
    const termSheetCount = useMockDownstream ? Math.max(0, Math.round(MOCK_FUNNEL.termSheet * scale)) : 0;

    const maxForPct = Math.max(matchedCount, 1);
    const pctReached = reachedCount ? Math.min(100, Math.round((reachedCount / maxForPct) * 100)) : 0;
    const pctInterested = reachedCount ? Math.min(100, Math.round((interestedCount / reachedCount) * 100)) : (useMockDownstream ? 53 : 0);
    const pctInTalks = reachedCount ? Math.min(100, Math.round((inTalksCount / reachedCount) * 100)) : (useMockDownstream ? 24 : 0);
    const pctTermSheet = reachedCount ? Math.min(100, Math.round((termSheetCount / reachedCount) * 100)) : (useMockDownstream ? 9 : 0);

    const stages = [
        { label: 'Matched', pct: 100, count: matchedCount, barColor: FUNNEL_BAR_COLORS[0] },
        { label: 'Reached', pct: pctReached, count: reachedCount, barColor: FUNNEL_BAR_COLORS[1] },
        { label: 'Interested', pct: pctInterested, count: interestedCount, barColor: FUNNEL_BAR_COLORS[2] },
        { label: 'In Talks', pct: pctInTalks, count: inTalksCount, barColor: FUNNEL_BAR_COLORS[3] },
        { label: 'Term Sheet', pct: pctTermSheet, count: termSheetCount, barColor: FUNNEL_BAR_COLORS[4] },
    ];

    const conversionPct = sent ? Math.round((accepted / sent) * 1000) / 10 : (useMockDownstream ? MOCK_FUNNEL.conversionPct : 0);
    const avgToTermSheet = useMockDownstream ? MOCK_FUNNEL.avgDaysToTermSheet : '—';
    const committedEst = useMockDownstream ? MOCK_FUNNEL.committedEst : '—';

    return (
        <div className="bg-white border-[1.5px] border-[#e8e3dc] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b918a] mb-1">Live Tracking</div>
                    <div className="font-display text-lg font-semibold text-[#3e3530]">Fundraise Funnel</div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#7a9b76]/20 text-[#7a9b76]">Active Round</span>
            </div>
            <div className="flex flex-col gap-2.5 mb-5">
                {stages.map((stage) => (
                    <div key={stage.label} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#6b615b] w-[100px] flex-shrink-0">{stage.label}</span>
                        <div className="flex-1 h-2 bg-[#f7f4f0] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-[width] duration-1000 ease-out"
                                style={{ width: `${stage.pct}%`, background: stage.barColor }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-[#3e3530] w-8 text-right flex-shrink-0">{stage.count}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-3 border-t border-[#e8e3dc] pt-4">
                <div className="flex-1 py-3 px-3 bg-[#f7f4f0] rounded-lg text-center">
                    <span className="font-display text-[22px] font-semibold text-[#3e3530] block leading-none mb-1">{conversionPct}%</span>
                    <span className="text-[10px] font-medium text-[#9b918a] uppercase tracking-wider">Conversion</span>
                </div>
                <div className="flex-1 py-3 px-3 bg-[#f7f4f0] rounded-lg text-center">
                    <span className="font-display text-[22px] font-semibold text-[#3e3530] block leading-none mb-1">{avgToTermSheet}</span>
                    <span className="text-[10px] font-medium text-[#9b918a] uppercase tracking-wider">Avg. to Term Sheet</span>
                </div>
                <div className="flex-1 py-3 px-3 bg-[#f7f4f0] rounded-lg text-center">
                    <span className="font-display text-[22px] font-semibold text-[#3e3530] block leading-none mb-1">{committedEst}</span>
                    <span className="text-[10px] font-medium text-[#9b918a] uppercase tracking-wider">Committed (est.)</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   PITCH READINESS (backend-driven)
   ═══════════════════════════════════════════ */
export function PitchReadiness({ data }: { data: DashboardData | null }) {
    const score = data?.readiness?.score ?? 0;
    const tier = data?.readiness?.tier ?? 'Bronze';
    const missingActions = data?.missingActions ?? [];
    const hasBasicProfile = !!(data?.startup?.startupName && data?.startup?.founderName);
    const dashOffset = 145 - (score / 100) * 109;

    // Build checklist: done items (from profile) + todo items (missingActions from backend)
    type CheckItem = { text: string; pts: string; done: boolean; warn?: boolean };
    const doneItems: CheckItem[] = hasBasicProfile ? [{ text: 'Founder profile complete', pts: 'Done', done: true }] : [];
    const todoItems: CheckItem[] = missingActions.map((a) => ({ text: a.label, pts: a.points, done: false, warn: a.pointsValue >= 10 }));
    const checklist: CheckItem[] = [...doneItems, ...todoItems];

    return (
        <div className="bg-white border-[1.5px] border-[#e8e3dc] rounded-2xl p-6">
            <div className="mb-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9b918a] mb-1">Action Items</div>
                <div className="font-display text-lg font-semibold text-[#3e3530]">Pitch Readiness</div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
                {checklist.length === 0 ? (
                    <p className="text-[13px] text-[#9b918a] py-2">Complete your startup profile to see action items.</p>
                ) : (
                    checklist.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-[#f7f4f0] border border-transparent hover:border-[#e8e3dc] transition-colors"
                        >
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                    item.done ? 'bg-[#7a9b76]/20 text-[#7a9b76]' : item.warn ? 'bg-[#d4a574]/20 text-[#d4a574]' : 'bg-[#e8e3dc] text-[#9b918a]'
                                }`}
                            >
                                {item.done ? '✓' : item.warn ? '!' : '○'}
                            </div>
                            <span className={`flex-1 text-[13px] font-medium ${item.done ? 'text-[#9b918a] line-through' : 'text-[#3e3530]'}`}>
                                {item.text}
                            </span>
                            <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                    item.done ? 'bg-[#7a9b76]/20 text-[#7a9b76]' : 'bg-[#d4a574]/20 text-[#b8865a]'
                                }`}
                            >
                                {item.pts}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <div className="bg-[#f7f4f0] rounded-[10px] p-4 flex items-center gap-4">
                <div className="relative w-[52px] h-[52px] flex-shrink-0">
                    <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
                        <circle cx="26" cy="26" r="21" fill="none" stroke="#e8e3dc" strokeWidth="4" />
                        <circle
                            cx="26"
                            cy="26"
                            r="21"
                            fill="none"
                            stroke="#d4a574"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={145}
                            strokeDashoffset={dashOffset}
                            className="transition-[stroke-dashoffset] duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-[#3e3530]">
                        {score}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#3e3530] mb-0.5">{tier} Tier · {score}/100</div>
                    <div className="text-[11px] text-[#9b918a]">
                        {missingActions.length > 0 ? `Complete ${missingActions.length} more item${missingActions.length !== 1 ? 's' : ''} to improve score` : 'Profile looking good'}
                    </div>
                </div>
                <Link
                    to="/startup/profile/edit"
                    className="text-xs font-semibold text-[#d4a574] border-[1.5px] border-[#e8c9a0] rounded-md py-1.5 px-3 whitespace-nowrap hover:bg-[rgba(212,165,116,0.1)] transition-colors inline-block"
                >
                    Improve →
                </Link>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   TRACTION + IMPACT TAGS
   ═══════════════════════════════════════════ */
export function TractionSnapshot({ data }: { data: DashboardData | null }) {
    const t = data?.startup?.traction || {};
    const sector = data?.startup?.sector || '';

    return (
        <section className="stagger-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[#f7f4f0] rounded-2xl p-5 shadow-soft border border-[#fffbf8] flex flex-col">
                <h3 className={`${LABEL_CLS} mb-4`}>Traction</h3>
                <div className="grid grid-cols-2 gap-y-5 gap-x-3 mt-auto">
                    <div>
                        <p className={LABEL_CLS}>Revenue</p>
                        <p className="font-semibold text-[#3e3530] text-[0.8rem] mt-0.5">
                            {t.revenue || '—'} <span className="text-[0.65rem] font-normal text-[#6b615b]">{t.revenueUnit || 'ARR'}</span>
                        </p>
                    </div>
                    <div>
                        <p className={LABEL_CLS}>Growth</p>
                        <p className="font-semibold text-[#7a9b76] text-[0.8rem] mt-0.5">
                            {t.growth || '—'} <span className="text-[0.65rem] font-normal text-[#6b615b]">{t.growthUnit || 'QoQ'}</span>
                        </p>
                    </div>
                    <div>
                        <p className={LABEL_CLS}>Users</p>
                        <p className="font-semibold text-[#3e3530] text-[0.8rem] mt-0.5">
                            {t.users || '—'} <span className="text-[0.65rem] font-normal text-[#6b615b]">{t.usersLabel || ''}</span>
                        </p>
                    </div>
                    <div>
                        <p className={LABEL_CLS}>Milestone</p>
                        <p className="font-semibold text-[#3e3530] text-[0.7rem] leading-tight mt-0.5">{t.milestone || '—'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#f7f4f0] rounded-2xl p-5 shadow-soft border border-[#fffbf8]">
                <h3 className={`${LABEL_CLS} mb-4`}>Impact Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {sector && (
                        <ImpactTag icon="🌱" label={sector} color="text-[#7a9b76]" bg="bg-[#7a9b76]/10" />
                    )}
                    {data?.startup?.stage && (
                        <ImpactTag icon="📈" label={data.startup.stage} color="text-[#d4a574]" bg="bg-[#d4a574]/10" />
                    )}
                    {data?.startup?.location && data.startup.location !== 'Not specified' && (
                        <ImpactTag icon="📍" label={data.startup.location} color="text-[#b8865a]" bg="bg-[#e8c9a0]/20" />
                    )}
                    {data?.startup?.pitch && (
                        <span className="inline-flex items-center gap-1 border border-[#3e3530]/20 text-[#3e3530] px-2.5 py-1 rounded-full text-[0.65rem] font-medium">
                            <span className="text-xs">📄</span> Pitch Deck Uploaded
                        </span>
                    )}
                    {data?.startup?.useOfFunds && (
                        <ImpactTag icon="💰" label="Funding Plan" color="text-[#7a9b76]" bg="bg-[#7a9b76]/10" />
                    )}
                </div>
            </div>
        </section>
    );
}

function ImpactTag({ icon, label, color, bg }: { icon: string; label: string; color: string; bg: string }) {
    return (
        <span className={`inline-flex items-center gap-1 ${bg} ${color} px-2.5 py-1 rounded-full text-[0.65rem] font-medium`}>
            <span className="text-xs">{icon}</span> {label}
        </span>
    );
}

/* ═══════════════════════════════════════════
   ACTIVITY + MESSAGES
   ═══════════════════════════════════════════ */
export function ActivityMessages({ data }: { data: DashboardData | null }) {
    const a = data?.activity;
    return (
        <section className="stagger-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Activity Overview */}
            <div className="bg-[#f7f4f0] rounded-2xl p-5 shadow-soft border border-[#fffbf8]">
                <h3 className={`${LABEL_CLS} mb-4`}>Activity</h3>
                <div className="grid grid-cols-2 gap-5">
                    <ActivityStat icon="solar:arrow-right-up-linear" iconColor="text-[#d4a574]" label="Sent" value={a?.totalSent ?? 0} />
                    <ActivityStat icon="solar:inbox-in-linear" iconColor="text-[#7a9b76]" label="Received" value={a?.totalReceived ?? 0} />
                    <ActivityStat icon="solar:check-circle-linear" iconColor="text-[#7a9b76]" label="Accepted" value={a?.accepted ?? 0} valueColor="text-[#7a9b76]" />
                    <div>
                        <p className={`${LABEL_CLS} mb-1`}>Status</p>
                        <div className="flex gap-2.5 items-baseline mt-1">
                            <span className="text-[0.75rem] font-semibold text-[#7a9b76]">✅ {a?.accepted ?? 0}</span>
                            <span className="text-[0.75rem] font-semibold text-[#c77567]">❌ {a?.declined ?? 0}</span>
                            <span className="text-[0.75rem] font-semibold text-[#d4a574]">⏳ {a?.pending ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Requests */}
            <div className="bg-[#f7f4f0] rounded-2xl p-5 shadow-soft border border-[#fffbf8] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display text-base tracking-tight text-[#3e3530] flex items-center gap-1.5">
                        Connection Requests
                        {(a?.pending ?? 0) > 0 && (
                            <span className="bg-[#d4a574] text-white w-4.5 h-4.5 rounded-full text-[0.55rem] flex items-center justify-center font-body">
                                {a?.pending ?? 0}
                            </span>
                        )}
                    </h3>
                </div>

                <div className="flex flex-col gap-1.5">
                    <StatRow label="Total Sent" value={a?.totalSent ?? 0} icon="solar:arrow-right-up-linear" color="text-[#d4a574]" />
                    <StatRow label="Accepted" value={a?.accepted ?? 0} icon="solar:check-circle-linear" color="text-[#7a9b76]" />
                    <StatRow label="Declined" value={a?.declined ?? 0} icon="solar:close-circle-linear" color="text-[#c77567]" />
                    <StatRow label="Pending" value={a?.pending ?? 0} icon="solar:clock-circle-linear" color="text-[#d4a574]" />
                </div>

                <a href="#" className="mt-3 text-[0.65rem] text-[#d4a574] font-semibold inline-flex items-center gap-0.5 hover:text-[#b8865a] transition-colors">
                    View All Requests <Icon icon="solar:arrow-right-linear" className="text-xs" />
                </a>
            </div>
        </section>
    );
}

function ActivityStat({ icon, iconColor, label, value, valueColor = 'text-[#3e3530]' }: { icon: string; iconColor: string; label: string; value: number; valueColor?: string }) {
    return (
        <div>
            <div className="flex items-center gap-1.5 mb-0.5">
                <Icon icon={icon} className={`text-base ${iconColor}`} />
                <span className={LABEL_CLS}>{label}</span>
            </div>
            <span className={`font-display text-2xl ${valueColor}`}>{value}</span>
        </div>
    );
}

function StatRow({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
    return (
        <div className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-[#e8e3dc]/30 transition-colors">
            <div className="flex items-center gap-2">
                <Icon icon={icon} className={`text-base ${color}`} />
                <span className="text-[0.75rem] text-[#6b615b]">{label}</span>
            </div>
            <span className="font-display text-base text-[#3e3530]">{value}</span>
        </div>
    );
}
