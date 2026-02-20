import { forwardRef } from 'react'

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const NeoCard = forwardRef<HTMLDivElement, NeoCardProps>(
  ({ children, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-chalk-white border border-border rounded-xl shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
NeoCard.displayName = 'NeoCard'
