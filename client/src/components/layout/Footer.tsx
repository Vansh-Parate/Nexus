import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-forest-ink text-cream">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold">Startup India Matchmaking</h3>
            <p className="font-body text-sm mt-2 opacity-90">
              India&apos;s most structured startup–investor discovery engine.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-label text-xs uppercase tracking-wider opacity-70">Quick links</span>
            <Link to="/" className="font-body text-sm hover:text-terracotta transition-colors">Home</Link>
            <Link to="/register" className="font-body text-sm hover:text-terracotta transition-colors">Register</Link>
            <Link to="/login" className="font-body text-sm hover:text-terracotta transition-colors">Login</Link>
          </div>
          <div className="flex gap-4">
            <a href="#" className="p-2 border border-cream/30 rounded-lg hover:border-terracotta transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 border border-cream/30 rounded-lg hover:border-terracotta transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 border border-cream/30 rounded-lg hover:border-terracotta transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-cream/20">
          <p className="font-body text-xs text-center opacity-80">
            © 2025 Startup India Matchmaking Initiative
          </p>
        </div>
      </div>
    </footer>
  )
}
