export function HandshakeIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Laptop base */}
      <rect x="80" y="180" width="240" height="24" rx="2" stroke="#1A1A1A" strokeWidth="3" fill="#E8DCC8"/>
      <rect x="100" y="100" width="200" height="100" rx="2" stroke="#1A1A1A" strokeWidth="3" fill="#FDFAF4"/>
      <line x1="100" y1="140" x2="300" y2="140" stroke="#1A1A1A" strokeWidth="2"/>
      {/* Handshake - simplified two arms */}
      <path d="M120 120 L160 80 L200 100 L240 70 L260 90" stroke="#C4622D" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <path d="M280 120 L240 80 L200 100 L160 70 L140 90" stroke="#2C3E2D" strokeWidth="8" strokeLinecap="round" fill="none"/>
      {/* Floating tags */}
      <g fontFamily="DM Mono" fontSize="10" fill="#1A1A1A">
        <rect x="60" y="50" width="48" height="20" rx="0" fill="#D4813A" stroke="#1A1A1A" strokeWidth="2"/>
        <text x="72" y="64">SaaS</text>
        <rect x="290" y="45" width="56" height="20" rx="0" fill="#D4813A" stroke="#1A1A1A" strokeWidth="2"/>
        <text x="298" y="59">₹50L</text>
        <rect x="320" y="120" width="60" height="20" rx="0" fill="#D4813A" stroke="#1A1A1A" strokeWidth="2"/>
        <text x="328" y="134">Series A</text>
        <rect x="20" y="130" width="52" height="20" rx="0" fill="#D4813A" stroke="#1A1A1A" strokeWidth="2"/>
        <text x="28" y="144">EdTech</text>
      </g>
    </svg>
  )
}
