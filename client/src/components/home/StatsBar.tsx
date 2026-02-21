export const StatsBar = () => {
    return (
        <section className="bg-[#3e3530] py-8 sm:py-12 px-4 sm:px-6 lg:px-[5rem]">
            <div className="max-w-[80rem] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-0">
                <div className="flex flex-col border-r border-white/10 px-3 sm:px-4 lg:px-8 first:pl-0 last:border-0 text-center sm:text-left">
                    <span className="font-display font-semibold text-[1.75rem] sm:text-[2.5rem] lg:text-[3.25rem] text-[#d4a574] leading-none mb-1 sm:mb-2">12,400+</span>
                    <span className="text-[0.6875rem] sm:text-[0.8125rem] text-[#fffbf8]/60">Startups Registered</span>
                </div>
                <div className="flex flex-col lg:border-r border-white/10 px-3 sm:px-4 lg:px-8 last:border-0 text-center sm:text-left">
                    <span className="font-display font-semibold text-[1.75rem] sm:text-[2.5rem] lg:text-[3.25rem] text-[#d4a574] leading-none mb-1 sm:mb-2">₹840<span className="text-[1.5rem] sm:text-[2rem]">Cr+</span></span>
                    <span className="text-[0.6875rem] sm:text-[0.8125rem] text-[#fffbf8]/60">Capital Deployed</span>
                </div>
                <div className="flex flex-col border-r border-white/10 px-3 sm:px-4 lg:px-8 last:border-0 text-center sm:text-left">
                    <span className="font-display font-semibold text-[1.75rem] sm:text-[2.5rem] lg:text-[3.25rem] text-[#d4a574] leading-none mb-1 sm:mb-2">94%</span>
                    <span className="text-[0.6875rem] sm:text-[0.8125rem] text-[#fffbf8]/60">Match Accuracy</span>
                </div>
                <div className="flex flex-col px-3 sm:px-4 lg:px-8 last:border-0 text-center sm:text-left">
                    <span className="font-display font-semibold text-[1.75rem] sm:text-[2.5rem] lg:text-[3.25rem] text-[#d4a574] leading-none mb-1 sm:mb-2">48<span className="text-[1.5rem] sm:text-[2rem]">hrs</span></span>
                    <span className="text-[0.6875rem] sm:text-[0.8125rem] text-[#fffbf8]/60">Avg. Time to First Connection</span>
                </div>
            </div>
        </section>
    );
};
