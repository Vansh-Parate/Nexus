import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { matchScoreApi } from '../../../api/endpoints';
import { useAuthStore } from '../../../store/authStore';
import { dashboardApi } from '../../../api/endpoints';

interface InvestorDetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    investor: {
        name: string;
        type: string;
        score: number;
        id?: string;
        firmName?: string;
        preferredSectors?: string[];
        preferredStages?: string[];
        ticketMin?: number;
        ticketMax?: number;
        thesis?: string;
    } | null;
}

interface MatchExplanation {
    score: number;
    contributions: {
        sector: { match: boolean; contribution: number; startup: string; investor: string };
        stage: { match: boolean; contribution: number; startup: string; investor: string };
        funding: { fit: boolean; contribution: number; startup_ask: number; investor_range: number[] };
        idea_similarity: { score: number; contribution: number; description: string };
    };
    breakdown: {
        total_score: number;
        factors: Array<{ name: string; value: string | boolean; impact: number }>;
        strengths: string[];
        weaknesses: string[];
    };
}

export function InvestorDetailPanel({ isOpen, onClose, investor }: InvestorDetailPanelProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [explanation, setExplanation] = useState<MatchExplanation | null>(null);
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const { user } = useAuthStore();
    const [startupData, setStartupData] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Fetch startup data and match explanation when panel opens
            if (investor?.id && user?.role === 'startup') {
                fetchExplanation();
            }
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setExplanation(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, investor?.id]);

    const fetchExplanation = async () => {
        if (!investor?.id) return;
        setLoadingExplanation(true);
        try {
            // Get startup data from dashboard
            const dashboardRes = await dashboardApi.get();
            const startup = dashboardRes.data.startup;
            setStartupData(startup);

            // Get match explanation
            const explainRes = await matchScoreApi.explain(startup, {
                preferredSectors: investor.preferredSectors,
                preferredStages: investor.preferredStages,
                ticketMin: investor.ticketMin,
                ticketMax: investor.ticketMax,
                thesis: investor.thesis,
            });
            setExplanation(explainRes.data);
        } catch (err) {
            console.error('Failed to fetch match explanation:', err);
        } finally {
            setLoadingExplanation(false);
        }
    };

    if (!isVisible && !isOpen) return null;

    const score = explanation?.score || investor?.score || 0;
    const scoreColor = score >= 80 ? 'var(--color-accent-success)' : score >= 60 ? 'var(--color-accent-warning)' : 'var(--color-accent-danger)';
    const contrib = explanation?.contributions;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-[#e8e3dc]/60 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Slide-in Detail Panel */}
            <aside
                className={`fixed right-0 top-0 bottom-0 w-full md:w-[480px] max-w-full bg-[#fffbf8] shadow-[0_0_40px_rgba(62,53,48,0.1)] z-50 transform transition-transform duration-300 ease-out flex flex-col border-l border-[#e8e3dc] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 md:p-8 flex justify-between items-center border-b border-[#e8e3dc]">
                    <div>
                        <h2 className="font-display text-2xl tracking-tight text-[#3e3530] leading-tight break-words">{investor?.name || 'Investor Details'}</h2>
                        <span className="bg-[#e8e3dc] text-[#6b615b] px-2 py-0.5 rounded text-[0.65rem] uppercase tracking-wide mt-1 inline-block">{investor?.type || 'Type'}</span>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f7f4f0] text-[#6b615b] hover:bg-[#e8e3dc] hover:text-[#3e3530] transition-colors">
                        <Icon icon="solar:close-linear" className="text-xl" />
                    </button>
                </div>

                <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">

                    <div className="flex items-center justify-between mb-10 bg-[#f7f4f0] p-6 rounded-2xl border border-[#e8e3dc]/50">
                        <span className="text-[#6b615b] font-medium">Overall Compatibility</span>
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl text-white shadow-soft"
                            style={{ backgroundColor: scoreColor }}
                        >
                            {score}%
                        </div>
                    </div>

                    <h3 className="text-xs uppercase tracking-widest text-[#9b918a] font-semibold mb-6">
                        {loadingExplanation ? 'Analyzing Match...' : 'AI Match Breakdown'}
                    </h3>

                    {loadingExplanation ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-10 h-10 rounded-full border-2 border-[#d4a574] border-t-transparent animate-spin"></div>
                        </div>
                    ) : explanation ? (
                        <>
                            <div className="flex flex-col gap-5 mb-6">
                                <FactorRow 
                                    label="Sector Match" 
                                    value={contrib?.sector?.match ? 100 : 0} 
                                    color={contrib?.sector?.match ? 'var(--color-accent-success)' : 'var(--color-accent-danger)'}
                                    contribution={contrib?.sector?.contribution}
                                    detail={`${contrib?.sector?.startup} ↔ ${contrib?.sector?.investor}`}
                                />
                                <FactorRow 
                                    label="Stage Match" 
                                    value={contrib?.stage?.match ? 100 : 0} 
                                    color={contrib?.stage?.match ? 'var(--color-accent-success)' : 'var(--color-accent-danger)'}
                                    contribution={contrib?.stage?.contribution}
                                    detail={`${contrib?.stage?.startup} ↔ ${contrib?.stage?.investor}`}
                                />
                                <FactorRow 
                                    label="Funding Fit" 
                                    value={contrib?.funding?.fit ? 100 : 0} 
                                    color={contrib?.funding?.fit ? 'var(--color-accent-success)' : 'var(--color-accent-warning)'}
                                    contribution={contrib?.funding?.contribution}
                                    detail={`₹${contrib?.funding?.startup_ask}L in [₹${contrib?.funding?.investor_range?.[0]}L - ₹${contrib?.funding?.investor_range?.[1]}L]`}
                                />
                                <FactorRow 
                                    label="Idea Similarity" 
                                    value={Math.round((contrib?.idea_similarity?.score || 0) * 100)} 
                                    color={contrib?.idea_similarity?.score > 0.3 ? 'var(--color-accent-success)' : contrib?.idea_similarity?.score > 0.1 ? 'var(--color-accent-warning)' : 'var(--color-accent-danger)'}
                                    contribution={contrib?.idea_similarity?.contribution}
                                    detail={`${((contrib?.idea_similarity?.score || 0) * 100).toFixed(1)}% semantic match`}
                                />
                            </div>

                            {explanation.breakdown && (
                                <div className="bg-[#f7f4f0] rounded-xl p-5 mb-6 border border-[#e8e3dc]">
                                    <h4 className="text-xs uppercase tracking-wider text-[#9b918a] font-semibold mb-3">Match Insights</h4>
                                    {explanation.breakdown.strengths.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-[#6b615b] mb-2 font-medium">Strengths:</p>
                                            <ul className="space-y-1">
                                                {explanation.breakdown.strengths.map((s, i) => (
                                                    <li key={i} className="text-xs text-[#7a9b76] flex items-center gap-1.5">
                                                        <Icon icon="solar:check-circle-linear" className="text-sm" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {explanation.breakdown.weaknesses.length > 0 && (
                                        <div>
                                            <p className="text-xs text-[#6b615b] mb-2 font-medium">Areas to Address:</p>
                                            <ul className="space-y-1">
                                                {explanation.breakdown.weaknesses.map((w, i) => (
                                                    <li key={i} className="text-xs text-[#c77567] flex items-center gap-1.5">
                                                        <Icon icon="solar:info-circle-linear" className="text-sm" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col gap-5 mb-10">
                            <FactorRow label="Sector Fit" value={100} color="var(--color-accent-success)" />
                            <FactorRow label="Stage Fit" value={80} color="var(--color-accent-success)" />
                            <FactorRow label="Ticket Compatibility" value={60} color="var(--color-accent-warning)" />
                        </div>
                    )}

                    {/* Radar Chart Placeholder - Can implement proper chart if needed, using SVG for now to match exactly */}
                    <div className="flex justify-center items-center py-4 relative">
                        <svg width="240" height="240" viewBox="0 0 200 200" className="overflow-visible">
                            {/* Grid background */}
                            <g className="radar-axis stroke-[#e8e3dc] stroke-[1] text-[#e8e3dc]" style={{ strokeDasharray: 4 }}>
                                <line x1="100" y1="100" x2="100" y2="20" />
                                <line x1="100" y1="100" x2="169.3" y2="60" />
                                <line x1="100" y1="100" x2="169.3" y2="140" />
                                <line x1="100" y1="100" x2="100" y2="180" />
                                <line x1="100" y1="100" x2="30.7" y2="140" />
                                <line x1="100" y1="100" x2="30.7" y2="60" />
                            </g>
                            {/* Outline Hexagons */}
                            <polygon points="100,20 169.3,60 169.3,140 100,180 30.7,140 30.7,60" className="fill-none stroke-[#e8e3dc] stroke-[1]" />
                            <polygon points="100,40 152,70 152,130 100,160 48,130 48,70" className="fill-none stroke-[#e8e3dc] stroke-[1]" />
                            <polygon points="100,60 134.6,80 134.6,120 100,140 65.4,120 65.4,80" className="fill-none stroke-[#e8e3dc] stroke-[1]" />

                            {/* Data Polygon (Sample representation) */}
                            <polygon
                                points="100,20 155,68 141.5,124 100,180 72,116 37.6,64"
                                className="fill-[#d4a574] fill-opacity-20 stroke-[#7a9b76] stroke-[2] animate-pulse-scale"
                                strokeLinejoin="round"
                            />

                            {/* Labels */}
                            <text x="100" y="10" textAnchor="middle" className="text-[0.55rem] fill-[#9b918a] text-xs">Sector</text>
                            <text x="175" y="60" textAnchor="start" className="text-[0.55rem] fill-[#9b918a] text-xs">Stage</text>
                            <text x="175" y="145" textAnchor="start" className="text-[0.55rem] fill-[#9b918a] text-xs">Ticket</text>
                            <text x="100" y="195" textAnchor="middle" className="text-[0.55rem] fill-[#9b918a] text-xs">Geo</text>
                            <text x="25" y="145" textAnchor="end" className="text-[0.55rem] fill-[#9b918a] text-xs">Risk</text>
                            <text x="25" y="60" textAnchor="end" className="text-[0.55rem] fill-[#9b918a] text-xs">ESG</text>
                        </svg>
                    </div>

                </div>

                <div className="p-6 md:p-8 border-t border-[#e8e3dc] bg-[#f7f4f0]/50">
                    <button className="w-full bg-[#d4a574] text-[#fffbf8] hover:bg-[#b8865a] py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-soft hover:shadow-card-hover block text-center">
                        Request Connect
                    </button>
                </div>

            </aside>
        </>
    );
}

function FactorRow({ 
    label, 
    value, 
    color, 
    contribution, 
    detail 
}: { 
    label: string
    value: number
    color: string
    contribution?: number
    detail?: string
}) {
    return (
        <div>
            <div className="flex justify-between items-end mb-1.5">
                <div className="flex-1">
                    <span className="text-xs text-[#6b615b]">{label}</span>
                    {detail && <p className="text-[0.65rem] text-[#9b918a] mt-0.5">{detail}</p>}
                </div>
                <div className="text-right">
                    <span className="text-sm font-semibold text-[#3e3530]">{value}%</span>
                    {contribution !== undefined && (
                        <span className="text-[0.65rem] text-[#9b918a] block mt-0.5">+{contribution.toFixed(1)} pts</span>
                    )}
                </div>
            </div>
            <div className="w-full h-1 bg-[#e8e3dc] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
}
