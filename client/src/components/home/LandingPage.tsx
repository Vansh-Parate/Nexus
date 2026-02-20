import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { StatsBar } from './StatsBar';
import { HowItWorks } from './HowItWorks';
import { DualRole } from './DualRole';
import { ScoreExplainer } from './ScoreExplainer';
import { DashboardPreview } from './DashboardPreview';
import { Testimonials } from './Testimonials';
import { CtaBanner } from './CtaBanner';
import { Footer } from './Footer';

export const LandingPage = () => {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.replace('#', '');
        // Let the page render before scrolling
        window.setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    }, [location.hash]);

    return (
        <div className="selection:bg-[#e8c9a0] selection:text-[#3e3530]">
            <Navbar />
            <Hero />
            <StatsBar />
            <HowItWorks />
            <DualRole />
            <ScoreExplainer />
            <DashboardPreview />
            <Testimonials />
            <CtaBanner />
            <Footer />
        </div>
    );
};
