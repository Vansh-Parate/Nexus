import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Rocket, Briefcase } from 'lucide-react'
import { NeoButton } from '../components/ui/NeoButton'
import { Footer } from '../components/layout/Footer'
import { HandshakeIllustration } from '../assets/illustrations/HandshakeIllustration'

const SECTORS = ['AgriTech', 'FinTech', 'EdTech', 'CleanEnergy', 'HealthTech', 'D2C', 'DeepTech', 'GovTech', 'SaaS', 'Mobility']

const STATS = [
  { value: '1,240', label: 'Startups Registered' },
  { value: '380', label: 'Active Investors' },
  { value: '₹42Cr+', label: 'Deals Initiated' },
  { value: '94%', label: 'Match Satisfaction' },
]

const STEPS = [
  { num: '01', title: 'Build Your Profile', desc: 'Startup or investor, structured intake' },
  { num: '02', title: 'Get Matched', desc: 'Our algorithm aligns sector, stage & ticket size' },
  { num: '03', title: 'Connect & Close', desc: 'Send connection requests, start conversations' },
]

const TESTIMONIALS = [
  { quote: 'Finally, a platform that gets the Indian startup ecosystem. No more cold emails.', author: 'Priya S.', role: 'Founder, EdTech' },
  { quote: 'Quality deal flow without the noise. My best investments came from here.', author: 'Raj M.', role: 'Angel Investor' },
]

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cream" />
        <div className="absolute inset-0 bg-noise pointer-events-none" aria-hidden />
        <div className="relative max-w-[1280px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-[72px] leading-[1.1] font-normal text-forest-ink">
              Find Your
            </h1>
            <h1 className="font-display text-[72px] leading-[1.1] font-bold italic text-terracotta -mt-2">
              Perfect Match.
            </h1>
            <p className="font-body text-base mt-6 text-forest-ink/90 max-w-xl">
              India&apos;s most structured startup–investor discovery engine. No cold emails. No noise.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/register?role=startup">
                <NeoButton variant="primary" className="gap-2">
                  <Rocket className="w-4 h-4" />
                  I&apos;m a Startup
                </NeoButton>
              </Link>
              <Link to="/register?role=investor">
                <NeoButton variant="outline" className="bg-chalk-white gap-2">
                  <Briefcase className="w-4 h-4" />
                  I&apos;m an Investor
                </NeoButton>
              </Link>
            </div>
          </motion.div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[280px] hidden lg:block">
            <HandshakeIllustration className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="w-full bg-terracotta/90 py-6">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <span className="font-display text-2xl md:text-3xl font-bold text-forest-ink block">{value}</span>
                <span className="font-body text-sm text-cream">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-forest-ink text-center mb-16">
            Three Steps to a Deal
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ num, title, desc }) => (
              <div
                key={num}
                className="relative bg-chalk-white border border-border p-8 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <span className="absolute top-4 right-4 font-display text-[120px] font-bold text-terracotta/20 leading-none">
                  {num}
                </span>
                <h3 className="font-display text-xl font-bold text-forest-ink relative">{title}</h3>
                <p className="font-body text-sm mt-2 text-forest-ink/80 relative">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors strip */}
      <section className="py-12 overflow-hidden">
        <div className="flex gap-4 animate-[scroll_30s_linear_infinite] w-max">
          {[...SECTORS, ...SECTORS].map((s) => (
            <span
              key={s}
              className="font-body text-sm px-4 py-2 bg-burnt-amber/25 text-forest-ink border border-border rounded-lg shrink-0"
            >
              {s}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-warm-sand/50">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display text-4xl text-forest-ink text-center mb-12">
            What Founders & Investors Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map(({ quote, author, role }) => (
              <div
                key={author}
                className="bg-warm-sand/70 border border-border p-8 rounded-xl shadow-[var(--shadow-soft)] relative"
              >
                <span className="font-display text-6xl text-terracotta absolute top-4 left-4">&quot;</span>
                <p className="font-body text-forest-ink pl-12 mt-4">{quote}</p>
                <p className="font-label text-sm mt-4 text-forest-ink/80">
                  — {author}, {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
