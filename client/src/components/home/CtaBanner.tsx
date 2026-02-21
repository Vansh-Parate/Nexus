import { Link } from 'react-router-dom';

export const CtaBanner = () => {
    return (
        <section className="relative bg-gradient-to-br from-[#d4a574] to-[#b8865a] py-[6.25rem] px-6 lg:px-[5rem] overflow-hidden flex items-center justify-center text-center">
            <div className="bg-noise z-0"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-[0.6875rem] font-medium tracking-[0.15em] uppercase text-white/90 mb-4 block">Start Your Journey</span>
                <h2 className="font-display font-semibold text-[2.5rem] lg:text-[4rem] text-white mb-6 tracking-tight leading-[1.1]">Your match is waiting.</h2>
                <p className="text-[1.125rem] lg:text-[1.25rem] text-white/80 font-light mb-10">Join 12,000+ startups and investors already discovering aligned opportunities on NEXUS.</p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <Link to="/register?role=startup" className="px-8 py-4 rounded-full bg-white text-[#3e3530] font-medium hover:bg-[#f7f4f0] shadow-sm transition-colors">
                        I'm a Startup — Create Profile
                    </Link>
                    <Link to="/register?role=investor" className="px-8 py-4 rounded-full border border-white text-white font-medium hover:bg-white/10 transition-colors">
                        I'm an Investor — Set Preferences
                    </Link>
                </div>

                <span className="text-[0.8125rem] text-white/60 font-light">Free to join &middot; No cold emails &middot; Structured discovery</span>
            </div>
        </section>
    );
};
