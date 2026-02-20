/** Success checkmark for pitch sent / received */
export function SuccessIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="38" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 40l10 10 22-22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
