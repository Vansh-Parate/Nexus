type Variant = 'sector' | 'stage' | 'match' | 'status' | 'default'

interface BadgeProps {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<Variant, string> = {
  sector: 'bg-dusty-sage/20 text-forest-ink border-border',
  stage: 'bg-burnt-amber/25 text-forest-ink border-border',
  match: 'bg-terracotta/15 text-terracotta border-terracotta/20',
  status: 'bg-burnt-amber/25 text-forest-ink border-border',
  default: 'bg-warm-sand/50 text-forest-ink border-border',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`font-label inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[11px] font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
