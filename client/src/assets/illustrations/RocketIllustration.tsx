export function RocketIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* India map outline - simplified */}
      <path d="M100 40 L140 60 L150 100 L130 160 L100 200 L70 160 L50 100 Z" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
      {/* Rocket */}
      <path d="M100 200 L95 120 L100 30 L105 120 Z" fill="#FDFAF4" stroke="#1A1A1A" strokeWidth="2"/>
      <ellipse cx="100" cy="85" rx="12" ry="18" fill="#C4622D" stroke="#1A1A1A" strokeWidth="2"/>
      <path d="M85 200 L90 120 M115 200 L110 120" stroke="#1A1A1A" strokeWidth="2"/>
      <path d="M100 30 L80 50 L100 45 L120 50 Z" fill="#D4813A" stroke="#1A1A1A" strokeWidth="2"/>
    </svg>
  )
}
