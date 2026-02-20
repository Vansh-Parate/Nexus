import React from 'react';
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
