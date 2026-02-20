export function CompassIllustration({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="70" stroke="#1A1A1A" strokeWidth="3" fill="#F5F0E8"/>
      <circle cx="80" cy="80" r="55" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
      <path d="M80 25 L95 75 L80 80 L65 75 Z" fill="#C4622D" stroke="#1A1A1A" strokeWidth="2"/>
      <path d="M80 135 L65 85 L80 80 L95 85 Z" fill="#2C3E2D" stroke="#1A1A1A" strokeWidth="2"/>
      <circle cx="80" cy="80" r="8" fill="#1A1A1A"/>
      <text x="72" y="22" fontFamily="DM Mono" fontSize="12" fill="#1A1A1A">N</text>
      <text x="72" y="155" fontFamily="DM Mono" fontSize="12" fill="#1A1A1A">S</text>
    </svg>
  )
}
