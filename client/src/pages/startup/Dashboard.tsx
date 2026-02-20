import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { dashboardApi } from '../../api/endpoints';
import {
  StartupSnapshot,
  MatchSummary,
  ReadinessScore,
  BenchmarkBanner,
  RecommendedInvestors,
  FundraiseFunnel,
  PitchReadiness,
} from '../../components/startup/dashboard/Widgets';
import type { DashboardData } from '../../components/startup/dashboard/Widgets';
import { InvestorDetailPanel } from '../../components/startup/dashboard/DetailPanel';
import { Icon } from '@iconify/react';

export default function StartupDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<{ name: string; type: string; score: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    dashboardApi
      .get()
      .then((res) => {
        setDashboardData(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard:', err);
        setError('Failed to load dashboard data. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenPanel = (investor: { name: string; type: string; score: number }) => {
    setSelectedInvestor(investor);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false)
  }

  if (loading) {
    return (
      <div className="font-body text-[#3e3530] bg-[#fffbf8] min-h-screen text-sm antialiased">
        <Sidebar />
        <div className="md:ml-[4.5rem] w-full min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4a574] border-t-transparent animate-spin"></div>
            <p className="text-[#9b918a] text-sm">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-body text-[#3e3530] bg-[#fffbf8] min-h-screen text-sm antialiased">
        <Sidebar />
        <div className="md:ml-[4.5rem] w-full min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 bg-[#f7f4f0] p-8 rounded-2xl border border-[#e8e3dc] max-w-md text-center">
            <Icon icon="solar:danger-triangle-linear" className="text-4xl text-[#c77567]" />
            <p className="text-[#3e3530] font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#d4a574] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#b8865a] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body text-[#3e3530] bg-[#fffbf8] min-h-screen text-sm antialiased selection:bg-[#e8c9a0] selection:text-[#3e3530] overflow-x-hidden">
      <Sidebar />

      {/* Main content — full width beside sidebar, content centered with balanced spacing */}
      <div className="md:ml-[4.5rem] w-full min-w-0">
        <main className="w-full max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 pb-24 md:pb-12 pt-6 md:pt-8 flex flex-col gap-8">

          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <p className="text-[0.7rem] uppercase tracking-widest text-[#9b918a] font-medium mb-1">Welcome back,</p>
              <h1 className="font-display text-2xl tracking-tight text-[#3e3530] leading-tight">
                {dashboardData?.startup.userName || dashboardData?.startup.founderName || 'Founder'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-xl bg-[#f7f4f0] border border-[#e8e3dc] flex items-center justify-center text-[#9b918a] hover:text-[#3e3530] hover:bg-[#e8e3dc] transition-colors">
                <Icon icon="solar:bell-linear" className="text-lg" />
              </button>
            </div>
          </header>

          {/* Section 1: Top Overview — 3 cards in a 4-3-3 grid */}
          <section className="grid grid-cols-1 lg:grid-cols-10 gap-5">
            <StartupSnapshot data={dashboardData} />
            <MatchSummary data={dashboardData} />
            <ReadinessScore data={dashboardData} />
          </section>

          {/* Benchmark Banner */}
          <BenchmarkBanner data={dashboardData} />

          {/* Recommended Investors */}
          <RecommendedInvestors
            matches={dashboardData?.matches || []}
            onOpenPanel={handleOpenPanel}
          />

          {/* Bottom section: Fundraise Funnel + Pitch Readiness (backend-driven) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
            <FundraiseFunnel data={dashboardData} />
            <PitchReadiness data={dashboardData} />
          </section>
        </main>
      </div>

      {/* Slide-in Detail Panel */}
      <InvestorDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        investor={selectedInvestor}
      />
    </div>
  );
}
