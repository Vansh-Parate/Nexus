export function MatchingIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background gradient circle */}
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.15)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FDFAF4', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#E8C9A0', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Central connection point */}
      <circle cx="200" cy="200" r="80" fill="url(#grad1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
      
      {/* Startup side (left) */}
      <g transform="translate(100, 200)">
        {/* Startup building/rocket */}
        <rect x="-25" y="-40" width="50" height="60" rx="4" fill="url(#grad2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        <path d="M-15 -40 L0 -55 L15 -40" fill="url(#grad2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        <circle cx="-10" cy="-20" r="3" fill="rgba(255,255,255,0.8)"/>
        <circle cx="10" cy="-20" r="3" fill="rgba(255,255,255,0.8)"/>
        <rect x="-20" y="0" width="40" height="8" rx="2" fill="rgba(255,255,255,0.6)"/>
        {/* Connection line */}
        <line x1="25" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
      </g>
      
      {/* Investor side (right) */}
      <g transform="translate(300, 200)">
        {/* Investor briefcase/money */}
        <rect x="-20" y="-30" width="40" height="35" rx="4" fill="url(#grad2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        <path d="M-15 -30 L-15 -40 L15 -40 L15 -30" fill="url(#grad2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        <circle cx="0" cy="-15" r="4" fill="rgba(255,255,255,0.8)"/>
        <rect x="-8" y="0" width="16" height="8" rx="2" fill="rgba(255,255,255,0.6)"/>
        {/* Connection line */}
        <line x1="-100" y1="0" x2="-25" y2="0" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="4 4"/>
      </g>
      
      {/* Match score indicator */}
      <g transform="translate(200, 200)">
        <circle cx="0" cy="0" r="35" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
        <text x="0" y="8" textAnchor="middle" fill="#FDFAF4" fontSize="24" fontWeight="bold" fontFamily="system-ui">94%</text>
        <text x="0" y="25" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="system-ui">Match</text>
      </g>
      
      {/* Decorative elements */}
      <circle cx="80" cy="100" r="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="320" cy="100" r="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="80" cy="300" r="3" fill="rgba(255,255,255,0.3)"/>
      <circle cx="320" cy="300" r="3" fill="rgba(255,255,255,0.3)"/>
    </svg>
  )
}
