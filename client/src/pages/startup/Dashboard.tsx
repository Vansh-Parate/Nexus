import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { api } from '../../api/client';
import {
  StartupSnapshot,
  MatchSummary,
  ReadinessScore,
  BenchmarkBanner,
  RecommendedInvestors,
  ImproveMatchScore,
  TractionSnapshot,
  ActivityMessages
} from '../../components/startup/dashboard/Widgets';
import { InvestorDetailPanel } from '../../components/startup/dashboard/DetailPanel';

interface Match {
  id: string;
  name: string;
  firmName?: string;
  preferredSectors: string[];
  ticketMin: number;
  ticketMax: number;
  preferredStages: string[];
  matchScore: number;
}

export default function StartupDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<{ name: string, type: string, score: number } | null>(null);

  useEffect(() => {
    api.get('/matches')
      .then((res) => {
        // Ensure matches is an array
        setMatches(res.data.matches || []);
      })
      .catch(err => {
        console.error("Failed to fetch matches:", err);
        // We will fall back to default data in the widget if matches is empty
      });
  }, []);

  const handleOpenPanel = (investor: { name: string, type: string, score: number }) => {
    setSelectedInvestor(investor);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="font-body text-[#3e3530] bg-[#fffbf8] flex min-h-screen text-sm antialiased selection:bg-[#e8c9a0] selection:text-[#3e3530] overflow-x-hidden">
      <Sidebar />

      {/* Main Content Wrapper */}
      <main className="flex-1 pb-24 md:pb-12 md:ml-16 p-6 md:p-8 xl:p-12 max-w-7xl mx-auto flex flex-col gap-8 w-full transition-all duration-300">

        {/* Section 1: Top Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          <StartupSnapshot />
          <MatchSummary />
          <ReadinessScore />
        </section>

        {/* Section 7: Benchmark Indicator Banner (Renumbering as per HTML comment flow) */}
        <BenchmarkBanner />

        {/* Section 2: Recommended Investors */}
        <RecommendedInvestors matches={matches} onOpenPanel={handleOpenPanel} />

        {/* Section 4: Improve Your Match */}
        <ImproveMatchScore />

        {/* Section 6: Traction Snapshot + Policy Alignment */}
        <TractionSnapshot />

        {/* Bottom Row: Activity & Messaging */}
        <ActivityMessages />

      </main>

      {/* Slide-in Detail Panel */}
      <InvestorDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        investor={selectedInvestor}
      />
    </div>
  );
}
